package backend.service.user.service;

import backend.common.id.Snowflake;
import backend.service.user.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

import java.util.List;

@Log4j2
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final Snowflake snowflake = new Snowflake();
    private final RoomRepository roomRepository;

}
