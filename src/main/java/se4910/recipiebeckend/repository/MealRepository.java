package se4910.recipiebeckend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import se4910.recipiebeckend.entity.Meal;

import java.util.List;

@Repository
public interface MealRepository extends JpaRepository<Meal,Long>
{

    @Override
    List<Meal> findAll();

    Meal findByMealName(String mealName);

}
