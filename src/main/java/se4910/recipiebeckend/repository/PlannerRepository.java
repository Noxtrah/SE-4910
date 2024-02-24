package se4910.recipiebeckend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import se4910.recipiebeckend.entity.MealPlanner;
import se4910.recipiebeckend.entity.User;

import java.util.List;

@Repository
public interface PlannerRepository  extends JpaRepository<MealPlanner,Long> {

   MealPlanner findByUser(User user);

}
