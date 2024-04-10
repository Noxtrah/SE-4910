package se4910.recipiebeckend.entity;

public enum ReportCause {

        WRONG_INGREDIENT(5),
        INAPPROPRIATE_IMAGE(3),
        UNHEALTHY_RECIPE(2);

        private final int limit;

        ReportCause(int limit) {
            this.limit = limit;
        }

        public int getLimit() {
            return limit;
        }

}
