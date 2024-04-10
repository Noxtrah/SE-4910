package se4910.recipiebeckend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import se4910.recipiebeckend.entity.Report;
import se4910.recipiebeckend.entity.ReportCause;
import se4910.recipiebeckend.entity.User;
import se4910.recipiebeckend.entity.UserRecipes;

import java.util.List;
import java.util.Optional;

public interface ReportRepository  extends JpaRepository<Report,Long> {

    Optional<Report> findById(long id);
    List<Report> findByUser(User user);
    List<Report>findByUserRecipesAndReportCause(UserRecipes userRecipes, ReportCause reportCause);

    Optional<Report> findByUserAndUserRecipes(User user, UserRecipes userRecipes);

}
