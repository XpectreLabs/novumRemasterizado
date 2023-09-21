import Styles                                   from "./modalBank.module.scss";
import Box                                      from "@mui/material/Box";
import Button                                   from "@mui/material/Button";
import AddIcon                                  from "@mui/icons-material/Add";
import CircularProgress                         from "@mui/material/CircularProgress";
import EditIcon                                 from "@mui/icons-material/Edit";
import { Formik, Form, FieldInputProps }        from "formik";
import { Modal, message, Input, AutoComplete }  from "antd";
import { useState }                             from "react";
import * as Yup                                 from "yup";
import fn                                       from "../../../utility";
import IconButton                               from "@mui/material/IconButton";
import EditOutlinedIcon                         from "@mui/icons-material/EditOutlined";
import Icon                                     from '@mui/material/Icon';
import ContentCopyIcon                          from '@mui/icons-material/ContentCopy';
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

const user_id = localStorage.getItem("user_id");

export const ModalBank = ({
  namePerson,
  fechaPago,
  txtConcept,
  txtCantidad,
  inputsIngresoEgreso,
  text,
  cargarDatos,
  edit,
  arrayData,
  rowId,
  saveDataEgreso,
  editBank,
  setListaDatos,
  duplicar,
}: {
  namePerson:           boolean;
  fechaPago:            boolean;
  txtConcept:           boolean;
  txtCantidad:          boolean;
  inputsIngresoEgreso:  boolean;
  text:                 string | boolean;
  cargarDatos:          Function;
  edit:                 boolean;
  arrayData:            any;
  rowId:                any;
  saveDataEgreso:       boolean;
  editBank:             boolean;
  setListaDatos:        any;
  duplicar:             boolean;
}) => {
  const [open,            setOpen]              = useState(false);
  const [confirmLoading,  setConfirmLoading]    = useState(false);
  const [messageApi,      contextHolder]        = message.useMessage();
  const [cargandoModal,   setcargandoModal]     = useState(false);
  const [value,           setValue]             = useState<any>();
  const [listConceptos,   setListConceptos]     = useState([]);
  const txtMonto = '';

  const [initialValuesCaja, setInitialValuesCaja] = useState({
    hdId:               "",
    txtNombre:          "",
    stTipo:             "",
    txtCantidadActual:  "",
  });

  const [initialValuesTabla, setInitialValuesTabla] = useState({
    hdId:         "",
    txtNombre:    "",
    txtConcepto:  "",
    stTipo:       "",
    stCategoria:  "",
    txtMonto:     "",
    txtFechaTentativaCobro: ''
  });

  const [initialValue, setInitialValue] = useState({
    hdId:               "",
    txtNombre:          "",
    stTipo:             "",
    txtCantidadActual:  "",
    txtConcepto:        "",
    stCategoria:        "",
    txtMonto:           "",
    txtFechaTentativaCobro: ""
  });

  const [initial, setInitial] = useState({
    txtConcepto:  "",
  });

  const showModal = () => {
    cargarConceptos(setListConceptos);
    setOpen(true);
  };

  const handleCancel = () => {
    setInitialValue({
      hdId:               "",
      txtNombre:          "",
      stTipo:             "0",
      txtCantidadActual:  "",
      txtConcepto:        "",
      stCategoria:        "",
      txtMonto:           "",
      txtFechaTentativaCobro: ''
    });
    setTimeout(() => {
      setOpen(false);
      setcargandoModal(false);
    }, 400);
  };

  const validarSubmit = () => {
    fn.ejecutarClick("#txtAceptar");
  };

  const editarBank = (id: any) => {
    showModal();
    const pos = fn.buscarPosicionArreglo(arrayData, id);
    console.log(arrayData)
    setTimeout(() => {
      setInitialValue({
        hdId:                   id,
        txtNombre:              arrayData[pos]["Nombre"],
        txtConcepto:            "",
        stTipo:                 arrayData[pos]["id_tipo"],
        txtCantidadActual:      arrayData[pos]["Monto"],
        stCategoria:            "",
        txtMonto:               "",
        txtFechaTentativaCobro: "",
      });
    }, 100);
  };

  const editar = (id: any) => {
    showModal();
    console.log(arrayData);
    const pos = fn.buscarPosicionArreglo(arrayData, id);

    setTimeout(() => {
      setInitialValue({
        hdId:                   id,
        txtNombre:              arrayData[pos]["name"],
        txtConcepto:            arrayData[pos]["concept"],
        stTipo:                 arrayData[pos]["id_payment_method"],
        txtCantidadActual:      "",
        stCategoria:            arrayData[pos]["id_category"],
        txtMonto:               arrayData[pos]["amount"],
        txtFechaTentativaCobro: arrayData[pos]["date_to_pay_o"],
      });
    }, 100);
  };

  const duplicarItem = (id: any) => {
    showModal();
    const pos = fn.buscarPosicionArreglo(arrayData, id);

    setTimeout(() => {
      setInitialValue({
        hdId:                   "",
        txtNombre:              arrayData[pos]["name"],
        txtConcepto:            arrayData[pos]["concept"],
        stTipo:                 arrayData[pos]["id_payment_method"],
        txtCantidadActual:      "",
        stCategoria:            arrayData[pos]["id_category"],
        txtMonto:               arrayData[pos]["amount"],
        txtFechaTentativaCobro: "",
      });
    }, 100);
  }

  function cargarConceptos(setListConceptos: Function) {
    let scriptURL = localStorage.getItem('site') + "/listConceptosIngresosFuturos";
    let dataUrl   = {user_id};
  
    fetch(scriptURL, {
      method: 'POST',
      body:   JSON.stringify(dataUrl),
      headers:{
        'Content-Type': 'application/json'
      }
    })
    .then((resp) => resp.json())
    .then(function(info) {
      setListConceptos(info['dataConceptos']);
    })
    .catch(error => {
      console.log   (error.message);
      console.error ('Error!', error.message);
    });
  }

  const handleConceptoChange = (event: Function | String  | any) => {
    setInitialValue({
      hdId:                   fn.obtenerValor("#hdId"),
      txtNombre:              fn.obtenerValor("#txtNombre"),
      txtConcepto:            event,
      stTipo:                 fn.obtenerValor("#stTipo"),
      txtCantidadActual:      "",
      stCategoria:            fn.obtenerValor("#stCategoria"),
      txtMonto:               fn.obtenerValor("#txtMonto")                ?? "",
      txtFechaTentativaCobro: fn.obtenerValor("#txtFechaTentativaCobro")  ?? "",
    });
  };

  // Función para realizar permitir solo números
  const handleKeyPress = (e: any) => {
    var key   = e.key;
    var regex = /[0-9]|\./;
    if( !regex.test(key) ) {
      e.preventDefault();
    }
  };

  return (
    <Box>
      <Box className={Styles.itemButton}>
        {
          duplicar
          ? text
              ? <Button
                  variant = "text"
                  classes = {{root: Styles.btnTxt}}
                  onClick = {() => {
                    duplicarItem(rowId);
                  }}
                >
                  Duplicar
                </Button>
              : <ContentCopyIcon
                  onClick = {() => {
                    duplicarItem(rowId);
                  }}
                  sx={{cursor: 'pointer'}}
                />
          : editBank
            ?(
              <IconButton type="button" aria-label="Edit">
                <EditOutlinedIcon 
                  sx      = {{cursor: 'pointer'}}
                  onClick = {() => {
                    editarBank(rowId);
                  }}
                />
              </IconButton>
            )
            : edit
              ? text
                  ? (
                    <Button
                      variant = "text"
                      classes = {{root: Styles.btnTxt}}
                      onClick = {() => {
                        editar(rowId);
                      }}
                    >
                      Editar
                    </Button>
                  )
                  : (
                    <EditIcon
                      sx      = {{cursor: 'pointer'}}
                      onClick = {() => {
                        editar(rowId);
                      }}
                    />
                  )
              : (
                <Box className={Styles.itemButton2}>
                  <Box className={Styles.btnText}>
                    <Button
                      variant   = "contained"
                      color     = "success"
                      startIcon = {<AddIcon />}
                      classes   = {{
                        root: Styles.btnCreateAccount,
                      }}
                      onClick   = {showModal}
                      sx        = {{cursor: 'pointer', textTransform: 'initial'}}
                    >
                      {text}
                    </Button>
                  </Box>

                  <Box className={Styles.btnIcon}>
                    <Icon 
                      color   = "success"
                      onClick = {showModal}
                      sx      = {{cursor: 'pointer'}}
                    >
                      <AddIcon />
                    </Icon>
                  </Box>
                </Box>
              )
        }
      </Box>

      <Modal
        title           = ""
        open            = {open}
        onOk            = {validarSubmit}
        confirmLoading  = {confirmLoading}
        onCancel        = {handleCancel}
        okText          = "Guardar"
        cancelText      = "Cancelar"
        maskClosable    = {false}
      >
        <Formik
          enableReinitialize  = {true}
          initialValues       = {initialValue}
          validationSchema={
            inputsIngresoEgreso
              ? Yup.object().shape({
                  txtNombre: Yup.string()
                    .min(
                      2,
                      namePerson
                        ? "El nombre de la persona o empresa es demasiado corto"
                        : "El nombre de la cuenta es demasiado corto"
                    )
                    .required(
                      namePerson
                        ? "* Nombre de la persona o empresa"
                        : "* Nombre de la cuenta"
                    ),
                  stTipo: Yup.number()
                    .min      (1, "Efectivo o banco")
                    .required ("* Efectivo o banco"),
                  txtConcepto: Yup.string()
                    .min      (3, "El concepto es demasiado corto")
                    .required ("* Concepto"),
                  stCategoria: Yup.number()
                    .min      (1, "Categoria")
                    .required ("* Categoria"),
                  txtMonto: Yup.number()
                    .min      (1, "Al menos un digito")
                    .required ("* Monto"),
                  txtFechaTentativaCobro: Yup.date().required(
                    fechaPago
                      ? "* Fecha tentativa de pago"
                      : "* Fecha tentativa de cobro"
                  ),
                })
              : Yup.object().shape({
                  txtNombre: Yup.string()
                    .min(
                      2,
                      namePerson
                        ? "El nombre de la persona o empresa es demasiado corto"
                        : "El nombre de la cuenta es demasiado corto"
                    )
                    .required(
                      namePerson
                        ? "* Nombre de la persona o empresa"
                        : "* Nombre de la cuenta"
                    ),
                  stTipo: Yup.number()
                    .min      (1, "Efectivo o banco")
                    .required ("* Efectivo o banco"),
                  txtCantidadActual: Yup.number()
                    .min      (1, "Al menos un digito")
                    .required ("* Cantidad actual"),
                })
          }
          onSubmit={
            inputsIngresoEgreso
              ? (values, actions) => {
                  let scriptURL = 
                    edit 
                    ? saveDataEgreso
                      ? localStorage.getItem('site') + "/editarEgresoFuturo"
                      : localStorage.getItem("site") + "/editarIngresoFuturo"
                    
                    : saveDataEgreso
                      ? localStorage.getItem('site') + "/altaEgresoFuturo"
                      : localStorage.getItem("site") + "/altaIngresoFuturo"

                  const txtNombre               = values.txtNombre;
                  const txtConcepto             = values.txtConcepto;
                  const stTipo                  = values.stTipo;
                  const stCategoria             = values.stCategoria;
                  const txtMonto                = values.txtMonto;
                  const txtFechaTentativaCobro  = new Date(values.txtFechaTentativaCobro).toISOString();
                  const txtFechaTentativaPago   = new Date(values.txtFechaTentativaCobro).toISOString();
                  const ingresos_futuros_id     = values.hdId;
                  const egresos_futuros_id      = values.hdId;
                  
                  const dataC = {
                    txtNombre,
                    txtConcepto,
                    stTipo,
                    stCategoria,
                    txtMonto,
                    user_id,
                    txtFechaTentativaCobro,
                    ingresos_futuros_id,
                  };

                  const dataP = {
                    txtNombre,
                    txtConcepto,
                    stTipo,
                    stCategoria,
                    txtMonto,
                    user_id,
                    txtFechaTentativaPago,
                    egresos_futuros_id,
                  };

                  setConfirmLoading(true);
                  fetch(scriptURL, {
                    method: "POST",
                    body:   JSON.stringify(saveDataEgreso ? dataP : dataC),
                    headers: {
                      "Content-Type": "application/json",
                    },
                  })
                    .then((response) => {
                      messageApi.open({
                        type:     "success",
                        content:  "Los datos del ingreso fueron guardados con éxito",
                      });
                      console.log("Si");

                      cargarDatos(
                        false,
                        setListaDatos,
                        true,
                        setInitialValuesTabla,
                        setOpen,
                        setConfirmLoading
                      );
                      setValue('');
                    })
                    .catch((error) => {
                      console.log(error.message);
                      console.error("Error!", error.message);
                    });
                }
              : (values, actions) => {
                  let scriptURL = 
                    edit 
                    ? localStorage.getItem("site") + "/editarCajaBanco"
                    : localStorage.getItem("site") + "/altaCajaBanco"

                  const txtNombre         = values.txtNombre;
                  const stTipo            = values.stTipo;
                  const txtCantidadActual = values.txtCantidadActual;
                  const caja_banco_id     = values.hdId;

                  const dataU = {
                    txtNombre,
                    stTipo,
                    txtCantidadActual,
                    user_id,
                    caja_banco_id,
                  };

                  setConfirmLoading(true);
                  fetch(scriptURL, {
                    method: "POST",
                    body:   JSON.stringify(dataU),
                    headers: {
                      "Content-Type": "application/json",
                    },
                  })
                    .then((response) => {
                      messageApi.open({
                        type:     "success",
                        content:  "Los datos fueron guardados con éxito",
                      });
                      console.log("Si caja");

                      cargarDatos(
                        false,
                        setListaDatos,
                        true,
                        setInitialValuesCaja,
                        setOpen,
                        setConfirmLoading
                      );
                      setValue('');
                    })
                    .catch((error) => {
                      console.log(error.message);
                      console.error("Error!", error.message);
                    });
                }
          }
        >
          {({ handleBlur, handleChange, handleSubmit, errors, values }) => {
            return (
              <Form
                className = {Styles.ModalForm}
                name      = "form-contacto"
                id        = "form-contacto"
                method    = "post"
                onSubmit  = {handleSubmit}
              >
                {contextHolder}

                <Box
                  className = {
                    cargandoModal ? "u-textCenter" : "u-textCenter u-ocultar"
                  }
                >
                  <CircularProgress />
                </Box>

                <div
                  className = {
                    cargandoModal ? "u-textCenter u-ocultar" : "u-textCenter"
                  }
                >
                  {/* ##### Campos permanentes ##### */}

                  <Input
                    id    = "hdId"
                    name  = "hdId"
                    type  = "hidden"
                    value = {values.hdId}
                  />

                  <Input
                    placeholder={
                      namePerson
                        ? "Nombre de la persona o empresa"
                        : "Nombre de la cuenta"
                    }
                    type            = "text"
                    id              = "txtNombre"
                    name            = "txtNombre"
                    value           = {values.txtNombre}
                    onChange        = {handleChange}
                    onBlur          = {handleBlur}
                    autoCapitalize  = "off"
                  />

                  {txtConcept ? (
                    <AutoComplete
                      id            = "txtConcepto"
                      className     = {Styles.autoComplete}
                      options       = {listConceptos}
                      placeholder   = "Concepto"
                      filterOption  = {(inputValue, option: any) =>
                        option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                      }
                      value         = {values.txtConcepto}
                      onChange      = {handleConceptoChange}
                      onBlur        = {handleBlur}
                    />
                  ) : null}

                  <select
                    name      = "stTipo"
                    className = {Styles.ModalSelect}
                    id        = "stTipo"
                    value     = {values.stTipo}
                    onChange  = {handleChange}
                  >
                    <option value="0"> Efectivo o banco </option>
                    <option value="1"> Efectivo         </option>
                    <option value="2"> Banco            </option>
                  </select>

                  {txtCantidad ? (
                    <Input
                      className   = {Styles.ModalCantidad}
                      placeholder = "Cantidad actual"
                      type        = "text"
                      id          = "txtCantidadActual"
                      name        = "txtCantidadActual"
                      value       = {values.txtCantidadActual}
                      onChange    = {handleChange}
                      onBlur      = {handleBlur}
                    />
                  ) : null}

                  {/* ##### Campos añadibles ##### */}

                  {inputsIngresoEgreso ? (
                    <>
                      <select
                        name        = "stCategoria"
                        id          = "stCategoria"
                        className   = {`${Styles.ModalSelect} u-sinMargen`}
                        value       = {values.stCategoria}
                        onChange    = {handleChange}
                      >
                        <option value="0"> Categoria  </option>
                        <option value="1"> Cliente    </option>
                        <option value="2"> Otros      </option>
                      </select>

                      <Input
                        className   = {`${Styles.ModalCantidad} ${Styles.ModalCantidadMr}`}
                        placeholder = "Monto"
                        type        = "text"
                        id          = "txtMonto"
                        name        = "txtMonto"
                        value       = {values.txtMonto}
                        onKeyPress  = {(e) => handleKeyPress(e)}
                        onChange    = {handleChange}
                        onBlur      = {handleBlur}
                      />

                      <input 
                        type      = "date" 
                        name      = "txtFechaTentativaCobro" 
                        id        = "txtFechaTentativaCobro"
                        className = {Styles.ModalDate}
                        placeholder = {
                          fechaPago
                            ? "Fecha tentativa de pago"
                            : "Fecha tentativa de cobro"
                        }
                        value     = {values.txtFechaTentativaCobro}
                        onChange  = {handleChange}
                        onBlur    = {handleBlur}
                      />
                    </>
                  ) : null}

                  {/*el div muestra el texto de validacion*/}
                  <div>
                    <p>
                      <strong>
                        {
                          errors.txtNombre          ||
                          errors.stTipo             ||
                          errors.txtCantidadActual  ||
                          errors.txtConcepto        ||
                          errors.stCategoria        ||
                          errors.txtMonto           ||
                          errors.txtFechaTentativaCobro
                          ? `Errores:`
                          : null
                        }
                      </strong>
                    </p>
                    {errors.txtNombre ? <p> {errors.txtNombre}  </p> : null}
                    {errors.stTipo    ? <p> {errors.stTipo}     </p> : null}
                    {errors.txtCantidadActual ? (
                      <p> {errors.txtCantidadActual} </p>
                    ) : null}
                    {errors.txtConcepto ? <p> {errors.txtConcepto}  </p> : null}
                    {errors.stCategoria ? <p> {errors.stCategoria}  </p> : null}
                    {errors.txtMonto    ? <p> {errors.txtMonto}     </p> : null}
                    {errors.txtFechaTentativaCobro ? (
                      <p> {errors.txtFechaTentativaCobro} </p>
                    ) : null}
                  </div>
                </div>

                <div className="u-textLeft" style={{ display: "none" }}>
                  <input id="txtAceptar" type="submit" value="Aceptar" />
                </div>
              </Form>
            );
          }}
        </Formik>
      </Modal>
    </Box>
  );
};
