package backend.service.groupChat.feign;

import backend.common.kafkaDto.room.RoomResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "room-service")
public interface RoomClient {

    @GetMapping("/api/rooms/{roomId}")
    RoomResponse getRoom(@PathVariable Long roomId);
}