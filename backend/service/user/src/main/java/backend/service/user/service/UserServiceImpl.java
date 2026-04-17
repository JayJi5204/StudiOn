package backend.service.user.service;

import backend.common.exception.CustomException;
import backend.common.exception.ErrorCode;
import backend.common.id.Snowflake;
import backend.service.user.dto.other.BoardDto;
import backend.service.user.dto.other.CommentDto;
import backend.service.user.dto.request.CreateRequest;
import backend.service.user.dto.request.DeleteRequest;
import backend.service.user.dto.request.LoginRequest;
import backend.service.user.dto.request.UpdateRequest;
import backend.service.user.dto.response.*;
import backend.service.user.entity.UserEntity;
import backend.service.user.feign.BoardClient;
import backend.service.user.feign.CommentClient;
import backend.service.user.util.JwtUtil;
import backend.service.user.repository.UserRepository;
import backend.service.user.util.CookieUtil;
import backend.service.user.util.SecurityUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.core.HttpHeaders;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.TimeUnit;

@Log4j2
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final Snowflake snowflake = new Snowflake();
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder encoder;
    private final JwtUtil jwtUtil;
    private final CookieUtil cookieUtil;
    private final StringRedisTemplate redisTemplate;
    private final BoardClient boardClient;
    private final CommentClient commentClient;

    @Override
    public CreateResponse create(CreateRequest dto) {
        UserEntity entity = userRepository.save(
                UserEntity.create(snowflake.nextId(), dto.getNickName(), encoder.encode(dto.getPassword()),
                        dto.getEmail(), dto.getPhoneNumber()));
        return CreateResponse.from(entity);
    }

    @Override
    public UpdateResponse update(UpdateRequest dto, HttpServletRequest request) {
        Long userId = SecurityUtil.getCurrentUserId(request);
        UserEntity entity = userRepository.findByUserId(userId);

        if (entity == null) {
            throw new CustomException(ErrorCode.USER_NOT_FOUND);
        }

        entity.update(dto.getNickName(), dto.getPassword(), dto.getEmail(), dto.getPhoneNumber(), dto.getBio());
        userRepository.save(entity);
        return UpdateResponse.from(entity);
    }

    @Override
    public DeletedResponse delete(DeleteRequest dto, HttpServletRequest request) {
        Long userId = SecurityUtil.getCurrentUserId(request);
        UserEntity entity = userRepository.findByUserId(userId);

        if (entity == null) {
            throw new CustomException(ErrorCode.USER_NOT_FOUND);
        }

        if (!encoder.matches(dto.getPassword(), entity.getPassword())) {
            throw new CustomException(ErrorCode.INVALID_PASSWORD);
        }

        entity.delete();
        return DeletedResponse.from(entity);
    }

    @Override
    @Transactional
    public LoginResponse login(LoginRequest dto, HttpServletResponse response) {
        UserEntity entity = userRepository.findByEmail(dto.getEmail());

        if (entity == null) {
            throw new CustomException(ErrorCode.INVALID_PASSWORD);
        }

        if (!encoder.matches(dto.getPassword(), entity.getPassword())) {
            throw new CustomException(ErrorCode.INVALID_PASSWORD);
        }

        String userId = String.valueOf(entity.getUserId());

        String accessToken = jwtUtil.createAccessToken(userId, entity.getEmail(), entity.getRole().toString(), entity.getNickName());
        String refreshToken = jwtUtil.createRefreshToken(userId, entity.getEmail(), entity.getRole().toString(), entity.getNickName());

        redisTemplate.opsForValue().set(userId, refreshToken, 7, TimeUnit.DAYS);

        ResponseCookie accessCookie = cookieUtil.createAccessTokenCookie(accessToken);
        ResponseCookie refreshCookie = cookieUtil.createRefreshTokenCookie(refreshToken);

        response.addHeader(HttpHeaders.SET_COOKIE, accessCookie.toString());
        response.addHeader(HttpHeaders.SET_COOKIE, refreshCookie.toString());
        entity.login();

        return LoginResponse.from(entity);
    }

    @Transactional
    public void reissue(HttpServletRequest request, HttpServletResponse response) {
        String refreshToken = cookieUtil.getCookieValue(request, "refreshToken");

        if (refreshToken == null) {
            throw new CustomException(ErrorCode.INVALID_TOKEN);
        }

        if (jwtUtil.isExpired(refreshToken)) {
            throw new CustomException(ErrorCode.INVALID_TOKEN);
        }

        String userId = jwtUtil.getUserId(refreshToken);
        String email = jwtUtil.getEmail(refreshToken);
        String role = jwtUtil.getRole(refreshToken);
        String nickName = jwtUtil.getNickName(refreshToken);

        String savedToken = redisTemplate.opsForValue().get(userId);

        if (savedToken == null || !savedToken.equals(refreshToken)) {
            throw new CustomException(ErrorCode.INVALID_TOKEN);
        }

        String newAccessToken = jwtUtil.createAccessToken(userId, email, role, nickName);
        String newRefreshToken = jwtUtil.createRefreshToken(userId, email, role, nickName);

        redisTemplate.opsForValue().set(userId, newRefreshToken, 7, TimeUnit.DAYS);

        ResponseCookie accessCookie = cookieUtil.createAccessTokenCookie(newAccessToken);
        ResponseCookie refreshCookie = cookieUtil.createRefreshTokenCookie(newRefreshToken);

        response.addHeader(HttpHeaders.SET_COOKIE, accessCookie.toString());
        response.addHeader(HttpHeaders.SET_COOKIE, refreshCookie.toString());
    }

    @Override
    public List<CreateResponse> getAllUsers() {
        List<UserEntity> entities = userRepository.findAll();
        return entities.stream().map(CreateResponse::from).toList();
    }

    @Override
    public GetMyInfoResponse getMyInfo(HttpServletRequest request) {
        Long userId = SecurityUtil.getCurrentUserId(request);
        UserEntity entity = userRepository.findByUserId(userId);

        if (entity == null) {
            throw new CustomException(ErrorCode.USER_NOT_FOUND);
        }

        List<BoardDto> responseBoards = boardClient.getBoards(userId);
        List<CommentDto> responseComments = commentClient.getComments(userId);

        return GetMyInfoResponse.from(entity, responseBoards, responseComments);
    }

    @Override
    public GetUserResponse getUser(Long userId) {
        UserEntity entity = userRepository.findByUserId(userId);

        if (entity == null) {
            throw new CustomException(ErrorCode.USER_NOT_FOUND);
        }

        List<BoardDto> responseBoards = boardClient.getBoards(userId);
        List<CommentDto> responseComments = commentClient.getComments(userId);

        return GetUserResponse.from(entity, responseBoards, responseComments);
    }

    @Override
    public GetUserResponse getUserByAdmin(Long userId) {
        UserEntity entity = userRepository.findByUserId(userId);

        if (entity == null) {
            throw new CustomException(ErrorCode.USER_NOT_FOUND);
        }

        List<BoardDto> boards = boardClient.getBoards(userId);
        List<CommentDto> comments = commentClient.getComments(userId);

        return GetUserResponse.from(entity, boards, comments);
    }

    @Override
    @Transactional
    public LogoutResponse logout(HttpServletResponse response, HttpServletRequest request) {
        Long userId = SecurityUtil.getCurrentUserId(request);
        UserEntity entity = userRepository.findByUserId(userId);

        if (entity == null) {
            throw new CustomException(ErrorCode.USER_NOT_FOUND);
        }

        redisTemplate.delete(String.valueOf(userId));

        ResponseCookie deleteAccessCookie = cookieUtil.deleteCookie("accessToken");
        ResponseCookie deleteRefreshCookie = cookieUtil.deleteCookie("refreshToken");

        response.addHeader(HttpHeaders.SET_COOKIE, deleteAccessCookie.toString());
        response.addHeader(HttpHeaders.SET_COOKIE, deleteRefreshCookie.toString());

        SecurityContextHolder.clearContext();
        entity.logout();

        return LogoutResponse.from(entity);
    }
}