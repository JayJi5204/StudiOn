package backend.service.studyGroup.controller;

import backend.service.studyGroup.dto.response.MemberResponse;
import backend.service.studyGroup.service.StudyMemberService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "StudyMember", description = "스터디 멤버 관리 API")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/study-members")
public class StudyMemberController {

    private final StudyMemberService studyMemberService;

    @Operation(summary = "가입 신청", description = "스터디 그룹에 가입을 신청합니다.")
    @PostMapping("/{groupId}/join")
    public MemberResponse join(
            @Parameter(description = "그룹 ID") @PathVariable Long groupId,
            HttpServletRequest httpRequest) {
        return studyMemberService.join(groupId, httpRequest);
    }

    @Operation(summary = "멤버 목록 조회", description = "스터디 그룹의 멤버 목록을 조회합니다.")
    @GetMapping("/{groupId}/members")
    public List<MemberResponse> getMembers(
            @Parameter(description = "그룹 ID") @PathVariable Long groupId) {
        return studyMemberService.getMembers(groupId);
    }

    @Operation(summary = "가입 신청 목록 조회 (회장만)", description = "가입 신청 중인 멤버 목록을 조회합니다.")
    @GetMapping("/{groupId}/members/pending")
    public List<MemberResponse> getPendingMembers(
            @Parameter(description = "그룹 ID") @PathVariable Long groupId,
            HttpServletRequest httpRequest) {
        return studyMemberService.getPendingMembers(groupId, httpRequest);
    }

    @Operation(summary = "가입 수락 (회장만)", description = "가입 신청을 수락합니다.")
    @PostMapping("/{groupId}/members/{userId}/accept")
    public MemberResponse accept(
            @Parameter(description = "그룹 ID") @PathVariable Long groupId,
            @Parameter(description = "유저 ID") @PathVariable Long userId,
            HttpServletRequest httpRequest) {
        return studyMemberService.accept(groupId, userId, httpRequest);
    }

    @Operation(summary = "가입 거절 (회장만)", description = "가입 신청을 거절합니다.")
    @PostMapping("/{groupId}/members/{userId}/reject")
    public void reject(
            @Parameter(description = "그룹 ID") @PathVariable Long groupId,
            @Parameter(description = "유저 ID") @PathVariable Long userId,
            HttpServletRequest httpRequest) {
        studyMemberService.reject(groupId, userId, httpRequest);
    }

    @Operation(summary = "멤버 추방 (회장만)", description = "멤버를 그룹에서 추방합니다.")
    @DeleteMapping("/{groupId}/members/{userId}/kick")
    public void kick(
            @Parameter(description = "그룹 ID") @PathVariable Long groupId,
            @Parameter(description = "유저 ID") @PathVariable Long userId,
            HttpServletRequest httpRequest) {
        studyMemberService.kick(groupId, userId, httpRequest);
    }

    @Operation(summary = "그룹 탈퇴", description = "스터디 그룹에서 탈퇴합니다. 회장은 탈퇴할 수 없습니다.")
    @DeleteMapping("/{groupId}/leave")
    public void leave(
            @Parameter(description = "그룹 ID") @PathVariable Long groupId,
            HttpServletRequest httpRequest) {
        studyMemberService.leave(groupId, httpRequest);
    }

    @Operation(summary = "회장 위임 (회장만)", description = "다른 멤버에게 회장을 위임합니다.")
    @PostMapping("/{groupId}/leader/{newLeaderId}")
    public void changeLeader(
            @Parameter(description = "그룹 ID") @PathVariable Long groupId,
            @Parameter(description = "새 회장 유저 ID") @PathVariable Long newLeaderId,
            HttpServletRequest httpRequest) {
        studyMemberService.changeLeader(groupId, newLeaderId, httpRequest);
    }
}