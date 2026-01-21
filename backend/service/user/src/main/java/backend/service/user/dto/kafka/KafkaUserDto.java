package backend.service.user.dto.kafka;

import backend.service.user.entity.UserEntity;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.io.Serializable;
import java.util.List;

@Data
@AllArgsConstructor
public class KafkaUserDto implements Serializable {

    private Schema schema;
    private Payload payload;


    public static KafkaUserDto from(UserEntity entity) {
        List<Field> fields = List.of(
                new Field("int64", false, "userId"),
                new Field("string", false, "email"),
                new Field("string", false, "username"),
                new Field("boolean", false, "isDeleted"),
                new Field("string", false, "role")
        );

        Schema schema = Schema.builder()
                .type("struct")
                .fields(fields)
                .optional(false)
                .name("users")
                .build();

        Payload payload = Payload.builder()
                .userId(entity.getUserId())
                .email(entity.getEmail())
                .username(entity.getUsername())
                .role(String.valueOf(entity.getRole()))
                .isDeleted(entity.getIsDeleted())
                .createAt(entity.getCreateAt().toString())
                .build();

        return new KafkaUserDto(schema, payload);
    }

}
