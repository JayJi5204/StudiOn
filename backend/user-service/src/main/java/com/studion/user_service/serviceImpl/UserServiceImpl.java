package com.studion.user_service.serviceImpl;

import com.studion.user_service.dto.request.UserRequestDto;
import com.studion.user_service.entity.UserEntity;
import com.studion.user_service.repository.UserRepository;
import com.studion.user_service.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;


@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    private final BCryptPasswordEncoder passwordEncoder;

    @Override
    public UserRequestDto createUser(UserRequestDto dto) {

        UserEntity user = UserEntity.builder()
                .userId(UUID.randomUUID().toString())
                .userName(dto.getUserName())
                .email(dto.getEmail())
                .encryptedPwd(passwordEncoder.encode(dto.getPassword()))
                .build();

        userRepository.save(user);


        return UserRequestDto.builder()
                .userId(user.getUserId())
                .userName(user.getUserName())
                .email(user.getEmail())
                .password(user.getEncryptedPwd())
                .build();
    }

    @Override
    public UserRequestDto getUserByUserId(String userId) {
        UserEntity userEntity = userRepository.findUserByUserId(userId);

        if (userEntity == null)
            throw new UsernameNotFoundException("User Not Found");

        return UserRequestDto.builder()
                .userId(userEntity.getUserId())
                .userName(userEntity.getUserName())
                .email(userEntity.getEmail())
                .password(passwordEncoder.encode(userEntity.getEncryptedPwd()))
                .build();
    }

    @Override
    public List<UserEntity> getUserByAll() {
        return userRepository.findAll();
    }

    @Override
    public UserRequestDto getUserDetailsByEmail(String email) {

        UserEntity userEntity = userRepository.findByEmail(email);

        return UserRequestDto.builder()
                .userId(userEntity.getUserId())
                .userName(userEntity.getUserName())
                .email(userEntity.getEmail())
                .password(userEntity.getEncryptedPwd())
                .build();

    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        UserEntity userEntity = userRepository.findByEmail(username);

        if (userEntity == null)
            throw new UsernameNotFoundException(username + ": not found");
        return new User(userEntity.getEmail(), userEntity.getEncryptedPwd(), true, true, true, true, new ArrayList<>());

    }
}
