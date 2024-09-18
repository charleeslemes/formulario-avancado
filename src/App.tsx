import {useForm, useFieldArray} from 'react-hook-form'
import { z } from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import { fields } from '@hookform/resolvers/ajv/src/__tests__/__fixtures__/data.js';



const  billsSchema = z.array(
  z.object({
    description: z.string().min(3, 'Por favor, informe uma descrição válida'),
    amount: z.number().positive('Por favor, informe um valor válido'),
  })
)

const schema = z.object({
  name:z.string().min(3, 'Por favor, informe um nome válido'),
  bills: billsSchema,
}).refine((fields)=> fields.bills.length > 0, {
  path: ['bills'],
  message: 'Por favor, informe pelo menos um conta!',
})


type FormDataprops = z.infer<typeof schema>

function App() {

  const { handleSubmit, control, register, formState:{errors} } = useForm<FormDataprops>({
    mode:'all',
    criteriaMode:'all',
    resolver:zodResolver(schema),
    
  })


  const {fields, append, remove} = useFieldArray({
    name: 'bills',
    control
  })



  const handleSubmitForm = (data: FormDataprops)=>{
    console.log(data)
  }

  return (

    
    <>

      <div className="container-form">

        <form onSubmit={handleSubmit(handleSubmitForm)}>
          <h2>Formulario avançado</h2>
          
          <div className="input-name">
              <input {...register('name')} type="text" placeholder='Informe seu nome' />
              {errors.name && <p>{errors.name.message}</p>}
          </div>
          {fields.map((field, index)=>(
            <div className='form-contas'>
              <div className="container-description-number">
                  <div className='input-form-adicionado' key={field.id}>
                    <input {...register(`bills.${index}.description`)} type="text" />
                    {errors?.bills && <p>{errors.bills[index]?.description?.message}</p>}
                  </div>
                 
                  <div className='input-form-adicionado' key={field.id}>
                    <input {...register(`bills.${index}.amount`,{valueAsNumber:true})} type="number" />
                    {errors?.bills && <p>{errors.bills[index]?.amount?.message}</p>}
                  </div>
              </div>
              <div className="container-btnremover">
                <button className='btnRemover' type='button' onClick={()=> remove(index)}>Remover</button>
              </div>
            </div>
          ))}

          <button className='btnAdicionar' type='button' onClick={() => append({description:'', amount: 0})}>Adicionar Conta</button>
            <br />
            <div className="container-btn-enviar">
              <button className='btnEnviar' type='submit'>Enviar</button>
              {errors?.bills && <p>{errors.bills?.message}</p>}
          </div>
        </form>


        </div>

    </>
  )
}

export default App
