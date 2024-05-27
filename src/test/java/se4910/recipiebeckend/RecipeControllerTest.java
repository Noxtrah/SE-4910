package se4910.recipiebeckend;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import se4910.recipiebeckend.controller.RecipeController;
import se4910.recipiebeckend.entity.Recipe;
import se4910.recipiebeckend.service.RecipeService;

import java.util.Arrays;
import java.util.List;
import java.util.ArrayList;

public class RecipeControllerTest {

    private MockMvc mockMvc;

    @Mock
    private RecipeService recipeService;

    @InjectMocks
    private RecipeController recipeController;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.initMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(recipeController).build();
    }
    @Test
    public void testIngredientBasedSearch() {
        // Arrange
        String targetIngredients = "tomato,cheese";

        Recipe recipe1 = new Recipe();
        recipe1.setTitle("Tomato Cheese Pizza");
        recipe1.setIngredients("tomato, cheese, dough");

        Recipe recipe2 = new Recipe();
        recipe2.setTitle("Cheese Salad");
        recipe2.setIngredients("cheese, lettuce, tomato");

        Recipe recipe3 = new Recipe();
        recipe3.setTitle("Pancake");
        recipe3.setIngredients("sugar, egg, flour");



        // Mock the service method
        when(recipeService.IngredientBasedSearch(anyList())).thenReturn(Arrays.asList(recipe1, recipe2));

        // Act
        List<Recipe> result = recipeController.IngredientBasedSearch(targetIngredients);

        assertTrue(result.contains(recipe1));
        assertTrue(result.contains(recipe2));
        assertFalse(result.contains(recipe3));
        assertEquals(2, result.size());
    }




}
