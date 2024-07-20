import { useNavigate } from "react-router-dom"
import { useState } from "react";
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

    const handleClick = async () => {
      setSelectedCategory(category);

      const fetchApi = async () => {
        try {
        const res:AxiosResponse = await api.get(`/category/${category}`)
        setQuizzes(res.data);
        } catch(err) {
          const error = err as AxiosError;
          if(error.response?.data){
            console.log((error.response.data as { message: string }).message);
          } else {
            console.log(`Error: ${error.message}`);
            
          } 
        }
      }
      await fetchApi()
      setSelectedCategory(null);
      navigate("/quizzes/play")
    }

  return (
    <div className='categoryCard' onClick={handleClick}>
        <p>{props.category}</p>
    </div>
  )
}

export default CategoryCard