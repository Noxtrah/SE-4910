package se4910.recipiebeckend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springdoc.core.models.GroupedOpenApi;

@Configuration
public class SwaggerConfig {

    // http://localhost:8282/swagger-ui/index.html#/
    //https://airlinemidterm4458.azurewebsites.net/swagger-ui/index.html#/
    @Bean
    public GroupedOpenApi customApi() {
        return GroupedOpenApi.builder()
                .group("custom-api")
                .pathsToMatch("/api/**")
                .build();
    }

    @Bean
    public OpenAPI openApiConfiguration() {
        return new OpenAPI()
                .components(new Components()
                        .addSecuritySchemes("bearer-key", new SecurityScheme()
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")
                        )
                )
                .info(new Info()
                        .title("Recipie project")
                        .version("1.0.0")
                        .description("Project Api")
                );

    }

}