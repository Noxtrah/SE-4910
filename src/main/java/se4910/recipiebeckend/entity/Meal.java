package se4910.recipiebeckend.entity;


import jakarta.persistence.*;
import lombok.Data;

@Entity(name = "meal")
@Table(name = "meal")
@Data
public class Meal
{


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String mealName;


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMealName() {
        return mealName;
    }

    public void setMealName(String mealName) {
        this.mealName = mealName;
    }
}
