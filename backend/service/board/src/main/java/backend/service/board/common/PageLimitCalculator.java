package backend.service.board.common;

public class PageLimitCalculator {
    public static Long calculatePageLimit(Long page,Long pageSize,Long movalbePageCount){
        return (((page-1)/movalbePageCount)+1)*pageSize*movalbePageCount+1;
    }
}
