import CategoryCard from "./Components/CategoryCard"
import Header from "./Header"

const QuizPage = () => {
  return (
    <>
    <Header /> 
    
    <div className="quizPage">
        <p className="intro">Pick a category</p>

        <div className="categoriesDiv">
            <CategoryCard category='Geography' />
            <CategoryCard category='Math' />
            <CategoryCard category='Biology' />
        </div>
    </div>
    </>
  )
}

export default QuizPage