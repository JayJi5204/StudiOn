package backend.service.board.dto.response;

import lombok.Data;

import java.util.List;
@Data
public class PageResponseDto {

    private List<BoardResponse> boardEntityList;
    private Long boardCount;

    public static PageResponseDto of(List<BoardResponse> boardResponseDto, Long boardCount) {
        PageResponseDto boardPageResponseResponseDtoDto = new PageResponseDto();
        boardPageResponseResponseDtoDto.boardEntityList = boardResponseDto;
        boardPageResponseResponseDtoDto.boardCount = boardCount;
        return boardPageResponseResponseDtoDto;

    }


}
