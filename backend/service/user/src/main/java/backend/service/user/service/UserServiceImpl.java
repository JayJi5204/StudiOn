package backend.service.user.service;

import backend.common.id.Snowflake;
import backend.service.user.dto.otherDto.BoardDto;
import backend.service.user.dto.otherDto.CommentDto;
import backend.service.user.dto.request.CreateRequest;
import backend.service.user.dto.request.DeleteRequest;
import backend.service.user.dto.request.LoginRequest;
import backend.service.user.dto.request.UpdateRequest;
import backend.service.user.dto.response.*;
import backend.service.user.entity.UserEntity;
import backend.service.user.feignClient.BoardClient;
import backend.service.user.feignClient.CommentClient;
import backend.common.jwt.JwtUtil;
import backend.service.user.repository.UserRepository;
import backend.service.user.util.SecurityUtil;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Log4j2
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final Snowflake snowflake = new Snowflake();
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder encoder;
    private final JwtUtil jwtUtil;

    private final BoardClient boardClient;
    private final CommentClient commentClient;

    @Override
    public CreateResponse create(CreateRequest dto) {

        UserEntity entity = userRepository.save(UserEntity.create(snowflake.nextId(), dto.getUsername(), encoder.encode(dto.getPassword()), dto.getEmail(), dto.getAdminPassword()));

        return CreateResponse.from(entity);
    }

    @Override
    public UpdateResponse update(UpdateRequest dto) {

        Long userId = SecurityUtil.getCurrentUserId();

        UserEntity entity = userRepository.findByUserId(userId);

        if (entity == null) {
            throw new RuntimeException("유저 없음");
        }

        entity.update(dto.getUsername(), dto.getPassword(), dto.getEmail());

        userRepository.save(entity);

        return UpdateResponse.from(entity);
    }

    @Override
    public DeletedResponse delete(DeleteRequest dto) {

        Long userId = SecurityUtil.getCurrentUserId();

        UserEntity entity = userRepository.findByUserId(userId);

        if (entity == null) {
            throw new RuntimeException("유저 없음");
        }

        entity.delete();

        return DeletedResponse.from(entity);
    }

    @Override
    public LoginResponse login(LoginRequest dto, HttpServletResponse response) {
        UserEntity entity = userRepository.findByEmail(dto.getEmail());

        if (entity == null) {
            throw new RuntimeException("입력하신 정보가 올바르지 않습니다.");
        }

        if (!encoder.matches(dto.getPassword(), entity.getPassword())) {
            throw new RuntimeException("입력하신 정보가 올바르지 않습니다.");
        }

        String userId = String.valueOf(entity.getUserId());

        String accessToken = jwtUtil.createAccessToken(userId, entity.getEmail(), entity.getRole().toString());

        String refreshToken = jwtUtil.createRefreshToken(userId, entity.getEmail(), entity.getRole().toString());

        return LoginResponse.from(entity, accessToken);
    }

    @Override
    public List<CreateResponse> getAllUsers() {
        List<UserEntity> entities = userRepository.findAll();
        return entities.stream().map(CreateResponse::from).toList();
    }

    @Override
    public GetMyInfoResponse getMyInfo() {

        Long userId = SecurityUtil.getCurrentUserId();

        UserEntity entity = userRepository.findByUserId(userId);

        if (entity == null) {
            throw new RuntimeException("존재하지 않는 사용자 입니다.");
        }

        List<BoardDto> responseBoards = boardClient.getBoards(userId);
        List<CommentDto> responseComments = commentClient.getComments(userId);

        return GetMyInfoResponse.from(entity, responseBoards, responseComments);
    }

    @Override
    public GetUserResponse getUser(Long userId) {

        UserEntity entity = userRepository.findByUserId(userId);

        if (entity == null) {
            throw new RuntimeException("존재하지 않는 사용자 입니다.");
        }
        List<BoardDto> responseBoards = boardClient.getBoards(userId);
        List<CommentDto> responseComments = commentClient.getComments(userId);

        return GetUserResponse.from(entity, responseBoards, responseComments);
    }

    @Override
    public GetUserResponse getUserByAdmin(Long userId) {

        UserEntity entity = userRepository.findByUserId(userId);

        if (entity == null) {
            throw new RuntimeException("존재하지 않는 사용자 입니다.");
        }

        List<BoardDto> boards = boardClient.getBoards(userId);
        List<CommentDto> comments = commentClient.getComments(userId);

        return GetUserResponse.from(entity, boards, comments);
    }

}
