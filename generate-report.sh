# From project root (todo-app/)
mkdir -p combined-results
cp tests/api/allure-results/* combined-results/ 2>/dev/null || :
cp tests/ui/allure-results/* combined-results/ 2>/dev/null || :
allure generate combined-results --clean -o combined-report
allure open combined-report