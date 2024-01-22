package se4910.recipiebeckend.response;


import java.util.List;

public class RecipeInfoResponse {

    List<Long> favIdList;
    List<RateResponse>rateResponseList;


    public RecipeInfoResponse(List<Long> favIdList, List<RateResponse> rateResponseList) {
        this.favIdList = favIdList;
        this.rateResponseList = rateResponseList;
    }

    public List<Long> getFavIdList() {
        return favIdList;
    }

    public void setFavIdList(List<Long> favIdList) {
        this.favIdList = favIdList;
    }

    public List<RateResponse> getRateResponseList() {
        return rateResponseList;
    }

    public void setRateResponseList(List<RateResponse> rateResponseList) {
        this.rateResponseList = rateResponseList;
    }
}
