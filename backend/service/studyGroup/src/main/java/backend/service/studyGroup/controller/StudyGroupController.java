package backend.service.studyGroup.controller;

import backend.service.studyGroup.dto.request.CreateGroupRequest;
import backend.service.studyGroup.dto.request.UpdateGroupRequest;
import backend.service.studyGroup.dto.response.GroupListResponse;
import backend.service.studyGroup.dto.response.GroupResponse;
import backend.service.studyGroup.service.StudyGroupService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "StudyGroup", description = "스터디 그룹 관리 API")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/study-groups")
public class StudyGroupController {

    private final StudyGroupService studyGroupService;

    @Operation(summary = "그룹 생성", description = "새로운 스터디 그룹을 생성합니다. 생성자는 자동으로 회장이 됩니다.")
    @PostMapping("/create")
    public GroupResponse create(@RequestBody @Valid CreateGroupRequest request,
                                HttpServletRequest httpRequest) {
        return studyGroupService.create(request, httpRequest);
    }

    @Operation(summary = "전체 그룹 조회", description = "생성일 기준 내림차순으로 전체 스터디 그룹을 조회합니다.")
    @GetMapping("/list")
    public List<GroupListResponse> getAllGroups(
            @RequestParam(required = false) String keyword) {
        return studyGroupService.getAllGroups(keyword);
    }

    @Operation(summary = "카테고리별 그룹 조회", description = "특정 카테고리의 스터디 그룹을 조회합니다.")
    @GetMapping("/list/category")
    public List<GroupListResponse> getGroupsByCategory(
            @Parameter(description = "카테고리") @RequestParam String category,
            @RequestParam(required = false) String keyword) {
        return studyGroupService.getGroupsByCategory(category, keyword);
    }

    @Operation(summary = "내 그룹 조회", description = "내가 가입한 스터디 그룹 목록을 조회합니다.")
    @GetMapping("/my")
    public List<GroupListResponse> getMyGroups(HttpServletRequest httpRequest) {
        return studyGroupService.getMyGroups(httpRequest);
    }

    @Operation(summary = "그룹 상세 조회", description = "그룹 ID로 스터디 그룹 상세 정보를 조회합니다.")
    @GetMapping("/{groupId}")
    public GroupResponse getGroup(
            @Parameter(description = "그룹 ID", example = "308307873695313920")
            @PathVariable Long groupId) {
        return studyGroupService.getGroup(groupId);
    }

    @Operation(summary = "초대코드로 그룹 조회", description = "초대코드로 비공개 스터디 그룹을 조회합니다.")
    @GetMapping("/invite/{inviteCode}")
    public GroupResponse getGroupByInviteCode(
            @Parameter(description = "초대코드", example = "AB1C2D3E")
            @PathVariable String inviteCode) {
        return studyGroupService.getGroupByInviteCode(inviteCode);
    }

    @Operation(summary = "그룹 수정 (회장만)", description = "스터디 그룹 정보를 수정합니다. 회장만 수정 가능합니다.")
    @PutMapping("/update/{groupId}")
    public GroupResponse update(
            @Parameter(description = "그룹 ID", example = "308307873695313920")
            @PathVariable Long groupId,
            @RequestBody @Valid UpdateGroupRequest request,
            HttpServletRequest httpRequest) {
        return studyGroupService.update(groupId, request, httpRequest);
    }

    @Operation(summary = "그룹 삭제 (회장만)", description = "스터디 그룹을 삭제합니다. 회장만 삭제 가능하며 모든 멤버도 함께 삭제됩니다.")
    @DeleteMapping("/delete/{groupId}")
    public void delete(
            @Parameter(description = "그룹 ID", example = "308307873695313920")
            @PathVariable Long groupId,
            HttpServletRequest httpRequest) {
        studyGroupService.delete(groupId, httpRequest);
    }
}