package se4910.recipiebeckend.repository;

import org.jetbrains.annotations.NotNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import se4910.recipiebeckend.entity.Report;
import se4910.recipiebeckend.entity.ReportCause;
import se4910.recipiebeckend.entity.User;
import se4910.recipiebeckend.entity.UserRecipes;

import java.util.List;
import java.util.Optional;

public interface ReportRepository  extends JpaRepository<Report,Long> {

    Optional<Report> findById(long id);

    List<Report> findAll();

    @Query("SELECT DISTINCT r.userRecipes.id FROM report r")
    List<Long> findAllDistinct();


    @Query("SELECT r.extraNotes, r.reportCause, r.user.username FROM report r WHERE r.userRecipes.id = :userRecipeId")
    List<Object[]> ReportDetailByUserRecipes_Id(@Param("userRecipeId") Long userRecipeId);

    List<Report> findByUserRecipes_Id(long id);
    List<Report> findByUser(User user);
    List<Report>findByUserRecipesAndReportCause(UserRecipes userRecipes, ReportCause reportCause);

    Optional<Report> findByUserAndUserRecipes(User user, UserRecipes userRecipes);

    @Query("SELECT r.reportCause, COUNT(r) FROM report r WHERE r.userRecipes.id = :userRecipeId GROUP BY r.reportCause")
    List<Object[]> countReportsByCause(@Param("userRecipeId") Long userRecipeId);

    @Query("SELECT r.extraNotes, u.username FROM report r JOIN r.user u WHERE r.reportCause = :reportCause AND r.userRecipes.id = :userRecipeId")
    List<Object[]> getInfoDetailsForCause(@Param("userRecipeId") Long userRecipeId, @Param("reportCause") String reportCause);



}
