package se4910.recipiebeckend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import se4910.recipiebeckend.entity.UserRecipes;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRecipeRepository extends JpaRepository<UserRecipes,Long>
{
    @Override
    List<UserRecipes> findAll();

    @Override
    Optional<UserRecipes> findById(Long userRecipeId);
}
