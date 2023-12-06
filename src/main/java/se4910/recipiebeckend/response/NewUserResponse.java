package se4910.recipiebeckend.response;

import se4910.recipiebeckend.entity.User;

public class NewUserResponse {


        private Long id;

        private String name;
        private String lastname;
        private String username;
        private String password;

        public NewUserResponse(User user)
        {
            this.id = user.getId();
            this.name = user.getName();
            this.lastname = user.getLastName();
            this.username = user.getUsername();

        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getLastname() {
            return lastname;
        }

        public void setLastname(String lastname) {
            this.lastname = lastname;
        }

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }


}
