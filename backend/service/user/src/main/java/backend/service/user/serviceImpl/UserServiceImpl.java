package backend.service.user.serviceImpl;

import backend.security.common.Snowflake;
import backend.service.user.dto.request.CreateRequest;
import backend.service.user.dto.request.DeleteRequest;
import backend.service.user.dto.request.LoginRequest;
import backend.service.user.dto.request.UpdateRequest;
import backend.service.user.dto.response.CreateResponse;
import backend.service.user.dto.response.DeletedResponse;
import backend.service.user.dto.response.LoginResponse;
import backend.service.user.dto.response.UpdateResponse;
import backend.service.user.entity.UserEntity;
import backend.service.user.repository.UserRepository;
import backend.service.user.service.UserService;
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

    @Override
    public CreateResponse create(CreateRequest dto) {

        UserEntity entity = userRepository.save(UserEntity.create(snowflake.nextId(), dto.getUsername(), encoder.encode(dto.getPassword()), dto.getEmail()));

        return CreateResponse.from(entity);
    }

    @Override
    public UpdateResponse update(UpdateRequest dto, Long userId) {
        UserEntity entity = userRepository.findUsersByUserId(userId);
        log.info(userId);
        entity.update(dto.getUsername(), dto.getUsername(), dto.getPassword());
        userRepository.save(entity);
        return UpdateResponse.from(entity);
    }

    @Override
    public DeletedResponse delete(DeleteRequest dto, Long userId) {
        UserEntity entity = userRepository.findUsersByUserId(userId);
        entity.delete();
        return DeletedResponse.from(entity);
    }

    public LoginResponse login(LoginRequest dto) {

        boolean check = userRepository.existsByPassword(dto.getPassword());
        UserEntity entity = userRepository.findByEmail(dto.getEmail());

        if (!check || entity == null) {
            throw new RuntimeException("입력하신 정보가 올바르지 않습니다.");
        }

        return LoginResponse.from(entity);
    }


    @Override
    public CreateResponse getUserByUserId(Long userId) {
        UserEntity entity = userRepository.findUsersByUserId(userId);
        return CreateResponse.from(entity);
    }

    @Override
    public List<CreateResponse> getUserByAll() {
        List<UserEntity> entities = userRepository.findAll();
        return entities.stream().map(CreateResponse::from).toList();
    }

}
