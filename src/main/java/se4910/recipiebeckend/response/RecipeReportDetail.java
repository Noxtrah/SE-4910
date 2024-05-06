package se4910.recipiebeckend.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import se4910.recipiebeckend.entity.Report;
import se4910.recipiebeckend.entity.ReportCause;

import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RecipeReportDetail {


    UserRecipeResponse userRecipeResponse;
    List<Object[]> reportDetail;


}