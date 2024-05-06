package se4910.recipiebeckend.request;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import se4910.recipiebeckend.entity.Report;
import se4910.recipiebeckend.entity.ReportCause;

@Getter
@Setter
@AllArgsConstructor
public class ReportRecipeRequest {

    long userRecipeId;
    ReportCause reportCause;
    String extraNotes;

}
