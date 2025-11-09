package backend.service.user.serviceImpl;

import backend.service.user.dto.request.CreateRequestDto;
import backend.service.user.dto.request.DeleteRequestDto;
import backend.service.user.dto.request.UpdateRequestDto;
import backend.service.user.dto.response.CreateResponseDto;
import backend.service.user.dto.response.DeletedResponseDto;
import backend.service.user.dto.response.UpdateResponseDto;
import backend.service.user.entity.UserEntity;
import backend.service.user.repository.UserRepository;
import backend.service.user.service.UserService;
import backend.security.common.Snowflake;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
//import org.springframework.security.core.userdetails.User;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.security.core.userdetails.UsernameNotFoundException;
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
    public CreateResponseDto create(CreateRequestDto dto) {

        UserEntity entity = userRepository.save(UserEntity.create(snowflake.nextId(), dto.getUserKey(), dto.getUserName(), encoder.encode(dto.getPassword()), dto.getEmail()));

        return CreateResponseDto.from(entity);
    }

    @Override
    public CreateResponseDto getUserByUserKey(String userKey) {
        UserEntity entity = userRepository.findUserByUserKey(userKey);

//        if (entity == null) throw new UsernameNotFoundException("User Not Found");

        return CreateResponseDto.from(entity);
    }

    @Override
    public List<CreateResponseDto> getUserByAll() {
        List<UserEntity> entities = userRepository.findAll();
        return entities.stream().map(CreateResponseDto::from).toList();
    }

    @Override
    public CreateRequestDto getUserDetailsByEmail(String email) {

        UserEntity userEntity = userRepository.findByEmail(email);

        return CreateRequestDto.builder().userKey(userEntity.getUserKey()).userName(userEntity.getUserName()).email(userEntity.getEmail()).password(userEntity.getPassword()).build();

    }

    @Override
    public UpdateResponseDto update(UpdateRequestDto dto, Long userId) {
        UserEntity entity = userRepository.findByUserId(userId);
        log.info(userId);
        entity.update(dto.getUserName(), dto.getUserName(), dto.getPassword());
        userRepository.save(entity);
        return UpdateResponseDto.from(entity);
    }

    @Override
    public DeletedResponseDto delete(DeleteRequestDto dto, Long userId) {
        UserEntity entity = userRepository.findByUserId(userId);
        entity.delete();
        return DeletedResponseDto.from(entity);
    }

//    @Override
//    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
//
//        UserEntity userEntity = userRepository.findByEmail(username);
//
//        if (userEntity == null) throw new UsernameNotFoundException(username + ": not found");
//        return new User(userEntity.getEmail(), userEntity.getPassword(), true, true, true, true, new ArrayList<>());
//
//    }
}
