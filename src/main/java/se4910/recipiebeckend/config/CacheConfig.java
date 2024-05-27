package se4910.recipiebeckend.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import se4910.recipiebeckend.service.UserRecipeService;
import se4910.recipiebeckend.service.UserService;

@Configuration
@EnableScheduling
public class CacheConfig {

    @Autowired
    private UserRecipeService userRecipeService;

    @Scheduled(fixedRate = 12 * 60 * 60 * 1000) // 12 saatte bir
    public void clearUserRecipesCache() {
        userRecipeService.clearUserRecipesCache();
    }
}
