package backend.service.user.security;

import backend.service.user.entity.UserEntity;
import backend.service.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;


    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

        UserEntity entity = userRepository.findByEmail(email);

        if (entity == null) {
            throw new UsernameNotFoundException("User not found");
        }

        return new CustomUserDetails(entity);

    }
}
