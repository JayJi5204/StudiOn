package backend.service.user.serviceImpl;

import backend.security.common.Snowflake;
import backend.service.user.dto.kafka.KafkaUserDto;
import backend.service.user.dto.otherDto.BoardDto;
import backend.service.user.dto.otherDto.CommentDto;
import backend.service.user.dto.request.CreateRequest;
import backend.service.user.dto.request.DeleteRequest;
import backend.service.user.dto.request.LoginRequest;
import backend.service.user.dto.request.UpdateRequest;
import backend.service.user.dto.response.*;
import backend.service.user.entity.UserEntity;
import backend.service.user.jwt.JwtUtil;
import backend.service.user.messageQueue.KafkaProducer;
import backend.service.user.repository.UserRepository;
import backend.service.user.service.UserService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Log4j2
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final Environment env;
    private final Snowflake snowflake = new Snowflake();
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder encoder;
    private final JwtUtil jwtUtil;
    private final RestTemplate restTemplate;
    private final KafkaProducer kafkaProducer;

    @Override
    public CreateResponse create(CreateRequest dto) {

        UserEntity entity = userRepository.save(UserEntity.create(snowflake.nextId(), dto.getUsername(), encoder.encode(dto.getPassword()), dto.getEmail()));

        KafkaUserDto kafkaUserDto = KafkaUserDto.from(entity);

        kafkaProducer.send("user-create", kafkaUserDto);

        return CreateResponse.from(entity);
    }

    @Override
    public UpdateResponse update(UpdateRequest dto, Long userId) {
        UserEntity entity = userRepository.findUsersByUserId(userId);
        log.info(userId);
        entity.update(dto.getUsername(), dto.getPassword(), dto.getEmail());
        userRepository.save(entity);
        KafkaUserDto kafkaUserDto = KafkaUserDto.from(entity);
        kafkaProducer.send("user-update", kafkaUserDto);
        return UpdateResponse.from(entity);
    }

    @Override
    public DeletedResponse delete(DeleteRequest dto, Long userId) {
        UserEntity entity = userRepository.findUsersByUserId(userId);
        entity.delete();
        KafkaUserDto kafkaUserDto = KafkaUserDto.from(entity);
        kafkaProducer.send("user-delete", kafkaUserDto);
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

        response.addHeader("accessToken", accessToken);

        return LoginResponse.from(entity, accessToken);
    }


    @Override
    public List<CreateResponse> getAllUsers() {
        List<UserEntity> entities = userRepository.findAll();
        return entities.stream().map(CreateResponse::from).toList();
    }

    @Override
    public GetUserResponse getUser(Long userId) {
        UserEntity entity = userRepository.findUsersByUserId(userId);
        String boardUrl = String.format(env.getProperty("board-service.url"), userId);
        String commentUrl = String.format(env.getProperty("comment-service.url"), userId);

        ResponseEntity<List<BoardDto>> responseBoardEntity = restTemplate.exchange(boardUrl, HttpMethod.GET, null, new ParameterizedTypeReference<List<BoardDto>>() {
        });
        List<BoardDto> responseBoards = responseBoardEntity.getBody();

        ResponseEntity<List<CommentDto>> responseCommentEntity = restTemplate.exchange(commentUrl, HttpMethod.GET, null, new ParameterizedTypeReference<List<CommentDto>>() {
        });
        List<CommentDto> responseComments = responseCommentEntity.getBody();
        return GetUserResponse.from(entity, responseBoards, responseComments);
    }

}
