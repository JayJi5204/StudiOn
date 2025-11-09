package backend.service.user.serviceImpl;

import backend.service.user.dto.request.UserRequestDto;
import backend.service.user.dto.response.UserResponseDto;
import backend.service.user.entity.UserEntity;
import backend.service.user.repository.UserRepository;
import backend.service.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import kuke.board.common.snowflake.Snowflake;

import java.util.ArrayList;
import java.util.List;


@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {


    private final Snowflake snowflake = new Snowflake();
    private final UserRepository userRepository;

    private final BCryptPasswordEncoder encoder;

    @Override
    public UserResponseDto createUser(UserRequestDto dto) {

        UserEntity entity=userRepository.save(
                UserEntity.create(snowflake.nextId(), dto.getUserKey(), dto.getUserName(), encoder.encode(dto.getPassword()), dto.getEmail())
        );

        return UserResponseDto.from(entity);
    }

    @Override
    public UserResponseDto getUserByUserKey(String userKey) {
        UserEntity entity = userRepository.findUserByUserKey(userKey);

        if (entity == null)
            throw new UsernameNotFoundException("User Not Found");

       return UserResponseDto.from(entity);
    }

    @Override
    public List<UserResponseDto> getUserByAll() {
        List<UserEntity> entities = userRepository.findAll();
        return entities.stream()
                .map(UserResponseDto::from)
                .toList();
    }

    @Override
    public UserRequestDto getUserDetailsByEmail(String email) {

        UserEntity userEntity = userRepository.findByEmail(email);

        return UserRequestDto.builder()
                .userKey(userEntity.getUserKey())
                .userName(userEntity.getUserName())
                .email(userEntity.getEmail())
                .password(userEntity.getPassword())
                .build();

    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        UserEntity userEntity = userRepository.findByEmail(username);

        if (userEntity == null)
            throw new UsernameNotFoundException(username + ": not found");
        return new User(userEntity.getEmail(), userEntity.getPassword(), true, true, true, true, new ArrayList<>());

    }
}
