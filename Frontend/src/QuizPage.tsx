import CategoryCard from "./Components/CategoryCard"

const QuizPage = () => {
  return (
    <div className="quizPage">
        <p className="intro">Pick a category</p>

        <div className="categoriesDiv">
            <CategoryCard category='Geography' />
            <CategoryCard category='Math' />
            <CategoryCard category='Biology' />
        </div>
    </div>
  )
}

export default QuizPage