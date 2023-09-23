import React                                from 'react';
import { Button, Input, Space, message }    from 'antd';
import { Formik, Form }                     from "formik";
import style                                from '../Registro/Registro.module.scss';
import IntlTelInput                         from 'react-intl-tel-input-18';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import * as Yup                             from "yup";
import Box                                  from '@mui/material/Box';
import fn                                   from "../../../utility";
import 'react-intl-tel-input-18/dist/main.css';

export const RegistroForm = () => {

const [passwordVisible, setPasswordVisible] = React.useState(false);
const [cargandoVisible, setCargandoVisible] = React.useState(false);

const obtenerValor = (input: any) => {
  let valorInput: HTMLInputElement = document.querySelector(input);
  return valorInput?.value;
};

return(
<div>
  <Formik
    initialValues={{
      nombre:           '',
      apellido:         '',
      puesto:           '',
      email:            '',
      empresa:          '',
      dedicaTuEmpresa:  '',
      numeroEmpleados:  '',
      password:         '',
      repitePasword:    '',
    }}
    
    validationSchema={Yup.object().shape({
      nombre: Yup.string()
      .min        (2, "Tu nombre es demasiado corto")
      .required   ("* Nombre"),
      apellido: Yup.string()
      .min        (2, "Tu apellido es demasiado corto")
      .required   ("* Apellido"),
      puesto: Yup.string()
      .min        (2, "Tu puesto es demasiado corto")
      .required   ("* Puesto"),
      email: Yup.string()
      .email      ("El email es incorrecto")
      .required   ("* Email"),
      //##########################
      empresa: Yup.string()
      .min        (2, "El nombre de la empresa es demasiado corto")
      .required   ("* Empresa"),
      dedicaTuEmpresa:  Yup.string()
      .min        (2, "El texto es demasiado corto")
      .required   ("* ¿A que se dedica tu empresa?"),
      numeroEmpleados:  Yup.number()
      .min        (1, "Al menos un digito")
      .required   ("* Número de empleados"),
      //$$$$$$$$$$$$$$$$$$$$$$$$$$$$
      password: Yup.string()
      .min        (8, 'La contraseña debe tener al menos 8 caracteres')
      .required   ("* Contraseña"),
      repitePasword:  Yup.string()
      .oneOf      ([Yup.ref('password')],"Las contraseñas deben ser iguales")
      .min        (8, 'La contraseña debe tener al menos 8 caracteres')
      .required   ("* Confirma contraseña"),
    })}

    onSubmit={(values, actions) => {
      setCargandoVisible(true);

      const scriptURL       = 'https://admin.bioesensi-crm.com/crearUsuario';
      const scriptURLC      = 'https://admin.bioesensi-crm.com/crearCliente';

      const hdEmail         = values.email
      const hdNombre        = values.nombre
      const hdApellido      = values.apellido
      const hdPuesto        = values.puesto
      const hdCelular       = obtenerValor('#txtCelular');
      const hdEmpresa       = values.empresa
      const hdDedica        = values.dedicaTuEmpresa
      const hdNumEmpleados  = values.numeroEmpleados
      const hdContrasenia   = values.password;

      let hdUser_id = 0;
      const data    = {hdEmail, hdContrasenia};
      //console.log('primer paso')

      fetch(scriptURL, {
        method: 'POST',
        body:   JSON.stringify(data),
        headers:{
          'Content-Type': 'application/json'
        }
      })
      .then((resp) => resp.json())
      .then(function(data) {
        hdUser_id = data.usuario_id;
        //alert('segundo paso')
        const dataC = {
          hdNombre,
          hdApellido,
          hdPuesto,
          hdCelular,
          hdEmpresa,
          hdDedica,
          hdNumEmpleados,
          hdUser_id,
        }

        fetch(scriptURLC, {
          method: 'POST',
          body:   JSON.stringify(dataC),
          headers:{
            'Content-Type': 'application/json'
          }
        })
        .then((resp) => resp.json())
        .then(function(data) {
          //alert('tercer paso')
          localStorage.setItem('user_id', JSON.stringify(hdUser_id));
          setCargandoVisible(false);

          message.success("Su registro se ha realizado con éxito!");
          setTimeout(() => {
            window.location.href = "/Home";
          }, 2000);
  
        })
        .catch(error => {
          alert(error.message);
          console.error('Error!', error.message);
        });

      })
      .catch(error => {
        alert(error.message);
        console.error('Error!', error.message);
      });

    }}
  >
    {({
      values,
      errors,
      handleChange,
      handleBlur,
      handleSubmit,
    }) => {
      return (
        <Form 
          className = {style.RegistroForm} 
          name      = "form-registro"
          id        = "form-registro"
          method    = "post" 
          onSubmit  = {handleSubmit}
        >
          <Input
            className       = {style.RegistroInputCol}
            placeholder     = "Nombre"
            type            = "text"
            id              = "txtNombre"
            name            = "nombre"
            onChange        = {handleChange}
            onBlur          = {handleBlur}
            autoCapitalize  = "off"
            value           = {values.nombre}
          />

          <Input
            className   = {`${style.RegistroInputCol} u-sinMargen`}
            placeholder = "Apellido"
            type        = "text"
            name        = "apellido"
            id          = "txtApellido"
            onChange    = {handleChange}
            onBlur      = {handleBlur}
            value       = {values.apellido}
          />

          <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
            <span>{errors.nombre}   </span>
            <span>{errors.apellido} </span>
          </Box>
            
          <Input
            placeholder = "Puesto"
            type        = "text"
            name        = "puesto"
            id          = "txtPuesto"
            onChange    = {handleChange}
            onBlur      = {handleBlur}
            value       = {values.puesto}
          />
          {errors.puesto}

          <Input
            placeholder     = "Email"
            type            = "email"
            name            = "email"
            id              = "txtEmail"
            onChange        = {handleChange}
            onBlur          = {handleBlur}
            autoCapitalize  = "off"
            autoCorrect     = "off"
            autoComplete    = "email"
            value           = {values.email}
          />
          {errors.email}

          <IntlTelInput
            fieldId             = 'txtCelular'
            fieldName           = "Celular"
            containerClassName  = "intl-tel-input"
            placeholder         = 'Celular'
            defaultCountry      = {'mx'}
            separateDialCode    = {true}
          />
          {/*0000000000000000000000000*/}
          <Input
            placeholder = "Nombre de la empresa"
            type        = "text"
            name        = "empresa"
            id          = "txtEmpresa"
            onChange    = {handleChange}
            onBlur      = {handleBlur}
            value       = {values.empresa}
          />
          {errors.empresa}

          <Input
            placeholder = "¿A que se dedica tu empresa?"
            type        = "text"
            name        = "dedicaTuEmpresa"
            id          = "txtDedicaTuEmpresa"
            onChange    = {handleChange}
            onBlur      = {handleBlur}
            value       = {values.dedicaTuEmpresa}
          />
          {errors.dedicaTuEmpresa}

          <Input
            placeholder = "Número de empleados"
            type        = "text"
            name        = "numeroEmpleados"
            id          = "txtnumeroEmpreados"
            onChange    = {handleChange}
            onBlur      = {handleBlur}
            value       = {values.numeroEmpleados}
          />
          {errors.numeroEmpleados}
          {/*0000000000000000000000000*/}
          <Space direction="vertical">
            <Input.Password 
              name        = 'password'
              id          = "txtPassword"
              placeholder = "Contraseña" 
              onChange    = {handleChange}
              onBlur      = {handleBlur}
              value       = {values.password}
            />
            {errors.password ? <p>{errors.password}</p> : null}

            <Input.Password 
              name        = 'repitePasword'
              placeholder = "Confirma contraseña"
              onChange    = {handleChange}
              onBlur      = {handleBlur}
              value       = {values.repitePasword}
              iconRender  = {(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />
            {errors.repitePasword ? (
              <p>{errors.repitePasword}</p>
            ) : null}
          </Space>

          <div>
            <span>
              <strong>
                {errors.password || errors.repitePasword
                  ? `Por favor complete el formulario antes de terminar`
                  : null
                }
              </strong>
            </span>
          </div>

          <Box className='u-textLeft' sx={{marginTop: '30px'}}>
            <input
              id="btnTerminar"
              className={`${style.RegistroBtnSiguiente} u-floatRight u-redondeado u-efecto`}
              type="submit"
              value="Terminar registro"
            />

          </Box>
        </Form>
      );
    }}
  </Formik>
</div>
)
}