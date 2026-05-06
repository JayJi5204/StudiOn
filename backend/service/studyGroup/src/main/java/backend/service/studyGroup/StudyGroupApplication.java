package backend.service.studyGroup;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication(scanBasePackages = {"backend.service.studyGroup", "backend.common"})
@EnableFeignClients
public class StudyGroupApplication {
    public static void main(String[] args) {
        SpringApplication.run(StudyGroupApplication.class, args);
    }
}