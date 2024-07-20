import { useNavigate } from "react-router-dom"
import { useState , useEffect} from "react";
import api from "../api/quizzes.ts"
import { AxiosError, AxiosResponse } from "axios";

export interface Props{
    category: string
}


interface Quiz {
  id: number;
  question: string; 
  category: string;
  type: string;
}

const CategoryCard = (props: Props) => {

    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const navigate = useNavigate();

    const category:string = props.category.toLowerCase().trim();

    useEffect(() => {
      if(quizzes.length > 0) {
        sessionStorage.setItem('quizzes', JSON.stringify(quizzes))
      }
    }, [quizzes])

    useEffect(() => {
      sessionStorage.clear();
    },[])



    const handleClick = async () => {
      setSelectedCategory(category);

      const fetchApi = async () => {
        try {
        const res:AxiosResponse = await api.get(`/category/${category}`)
        setQuizzes(res.data);
        setTimeout(() => {
          navigate("/quizzes/play")
        }, 300);
        } catch(err) {
          const error = err as AxiosError;
          if(error.response?.data){
            alert(error.response.data);
          } else {
            console.log(`Error: ${error.message}`);
            
          } 
        }
      }
      await fetchApi()
      setSelectedCategory(null);
    }

  return (
    <div className='categoryCard' onClick={handleClick}>
        <p>{props.category}</p>
    </div>
  )
}

export default CategoryCard