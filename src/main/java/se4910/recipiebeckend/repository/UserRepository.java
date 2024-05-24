package se4910.recipiebeckend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import se4910.recipiebeckend.entity.User;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User,Long>
{
    @Override
    Optional<User> findById(Long userId);

    User findUserByUsername(String username);
    @Override
    List<User> findAll();


}
