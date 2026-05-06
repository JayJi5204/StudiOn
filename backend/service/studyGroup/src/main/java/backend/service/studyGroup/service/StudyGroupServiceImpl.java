package backend.service.studyGroup.service;

import backend.common.enumType.MemberStatus;
import backend.common.enumType.StudyGroupCategory;
import backend.common.exception.CustomException;
import backend.common.exception.ErrorCode;
import backend.common.id.Snowflake;
import backend.common.util.SecurityUtil;
import backend.service.studyGroup.dto.request.CreateGroupRequest;
import backend.service.studyGroup.dto.request.UpdateGroupRequest;
import backend.service.studyGroup.dto.response.GroupListResponse;
import backend.service.studyGroup.dto.response.GroupResponse;
import backend.service.studyGroup.entity.StudyGroupEntity;
import backend.service.studyGroup.entity.StudyMemberEntity;
import backend.service.studyGroup.repository.StudyGroupRepository;
import backend.service.studyGroup.repository.StudyMemberRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class StudyGroupServiceImpl implements StudyGroupService {

    private final StudyGroupRepository studyGroupRepository;
    private final StudyMemberRepository studyMemberRepository;
    private final Snowflake snowflake = new Snowflake();

    @Override
    @Transactional
    public GroupResponse create(CreateGroupRequest request, HttpServletRequest httpRequest) {
        Long userId = SecurityUtil.getCurrentUserId(httpRequest);
        String nickName = SecurityUtil.getNickname(httpRequest);

        String inviteCode = UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        StudyGroupEntity group = StudyGroupEntity.create(
                snowflake.nextId(), request.getGroupName(), request.getDescription(),
                userId, request.getCategory(), request.isPrivate(),
                inviteCode, request.getDayOfWeek(), request.getStudyTime(),
                request.getTags()
        );
        studyGroupRepository.save(group);

        StudyMemberEntity leader = StudyMemberEntity.create(
                snowflake.nextId(), group.getGroupId(), userId, nickName
        );
        leader.accept();
        studyMemberRepository.save(leader);

        return GroupResponse.from(group);
    }


    @Override
    public GroupResponse getGroup(Long groupId) {
        StudyGroupEntity group = studyGroupRepository.findById(groupId)
                .orElseThrow(() -> new CustomException(ErrorCode.GROUP_NOT_FOUND));
        return GroupResponse.from(group);
    }

    @Override
    public List<GroupListResponse> getAllGroups(String keyword) {
        if (keyword != null && !keyword.isBlank()) {
            return studyGroupRepository.findByGroupNameContainingOrderByCreatedAtDesc(keyword)
                    .stream()
                    .map(GroupListResponse::from)
                    .toList();
        }
        return studyGroupRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(GroupListResponse::from)
                .toList();
    }

    @Override
    public List<GroupListResponse> getGroupsByCategory(String category, String keyword) {
        StudyGroupCategory studyGroupCategory = StudyGroupCategory.valueOf(category);
        if (keyword != null && !keyword.isBlank()) {
            return studyGroupRepository.findByCategoryAndGroupNameContainingOrderByCreatedAtDesc(
                            studyGroupCategory, keyword)
                    .stream()
                    .map(GroupListResponse::from)
                    .toList();
        }
        return studyGroupRepository.findAllByCategoryOrderByCreatedAtDesc(studyGroupCategory)
                .stream()
                .map(GroupListResponse::from)
                .toList();
    }

    @Override
    public List<GroupListResponse> getMyGroups(HttpServletRequest httpRequest) {
        Long userId = SecurityUtil.getCurrentUserId(httpRequest);
        return studyMemberRepository.findAllByUserIdAndStatus(userId, MemberStatus.ACCEPTED)
                .stream()
                .map(member -> studyGroupRepository.findById(member.getGroupId())
                        .map(GroupListResponse::from)
                        .orElse(null))
                .filter(g -> g != null)
                .toList();
    }

    @Override
    @Transactional
    public GroupResponse update(Long groupId, UpdateGroupRequest request, HttpServletRequest httpRequest) {
        Long userId = SecurityUtil.getCurrentUserId(httpRequest);
        StudyGroupEntity group = studyGroupRepository.findById(groupId)
                .orElseThrow(() -> new CustomException(ErrorCode.GROUP_NOT_FOUND));

        if (!group.getLeaderId().equals(userId)) {
            throw new CustomException(ErrorCode.UNAUTHORIZED);
        }

        group.update(request.getGroupName(), request.getDescription(),
                request.getCategory(), request.getDayOfWeek(), request.getStudyTime(),
                request.getTags(), request.getIsPrivate());
        studyGroupRepository.save(group);
        return GroupResponse.from(group);
    }

    @Override
    @Transactional
    public void delete(Long groupId, HttpServletRequest httpRequest) {
        Long userId = SecurityUtil.getCurrentUserId(httpRequest);
        StudyGroupEntity group = studyGroupRepository.findById(groupId)
                .orElseThrow(() -> new CustomException(ErrorCode.GROUP_NOT_FOUND));

        if (!group.getLeaderId().equals(userId)) {
            throw new CustomException(ErrorCode.UNAUTHORIZED);
        }

        studyMemberRepository.findAllByGroupId(groupId)
                .stream()
                .forEach(member -> studyMemberRepository.delete(member));
        studyGroupRepository.delete(group);
    }

    @Override
    public GroupResponse getGroupByInviteCode(String inviteCode) {
        StudyGroupEntity group = studyGroupRepository.findByInviteCode(inviteCode)
                .orElseThrow(() -> new CustomException(ErrorCode.GROUP_NOT_FOUND));
        return GroupResponse.from(group);
    }
}