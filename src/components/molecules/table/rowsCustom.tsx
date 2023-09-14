import * as React                 from "react";
import Styles                     from "../../../pages/registroIngreso/ingresos.module.scss";
import Style                      from '../../../pages/registroEgreso/egreso.module.scss';
import TableCell                  from "@mui/material/TableCell";
import TableRow                   from "@mui/material/TableRow";
import PaymentOutlinedIcon        from "@mui/icons-material/PaymentOutlined";
import RequestQuoteOutlinedIcon   from "@mui/icons-material/RequestQuoteOutlined";
import { ModalBank }              from '../../organims/modalRegister';
import { ModalTB }                from '../../organims/modalTable';
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";

const formatNumber = (number: number) =>
  new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(number);

export const RowsCustom = ({
  pullData,
  page,
  rowsPerPage,
  setInitialValues,
  status,
  cargarDatosIngresos,
  setListaDatos,
  confirm2Loading,
  setConfirm2Loading,
  cargarDatosEgresos,
}: {
  pullData:             any;
  page:                 any;
  rowsPerPage:          any;
  setInitialValues:     Function;
  status:               boolean;
  cargarDatosIngresos:  Function;
  setListaDatos:        any;
  confirm2Loading:      any;
  setConfirm2Loading:   Function;
  cargarDatosEgresos:   Function;
}) => {

  return (
    <>
      {pullData
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
        .map(
          (data: {
            name:
              | boolean
              | React.ReactElement<
                  any,
                  string | React.JSXElementConstructor<any>
                >
              | Iterable<React.ReactNode>
              | React.Key
              | null
              | undefined;
            id: any;
            date_created:
              | string
              | number
              | boolean
              | React.ReactElement<
                  any,
                  string | React.JSXElementConstructor<any>
                >
              | Iterable<React.ReactNode>
              | React.ReactPortal
              | null
              | undefined;
            payment_method: string;
            category:
              | string
              | number
              | boolean
              | React.ReactElement<
                  any,
                  string | React.JSXElementConstructor<any>
                >
              | Iterable<React.ReactNode>
              | React.ReactPortal
              | null
              | undefined;
            concept:
              | string
              | number
              | boolean
              | React.ReactElement<
                  any,
                  string | React.JSXElementConstructor<any>
                >
              | Iterable<React.ReactNode>
              | React.ReactPortal
              | null
              | undefined;
            amount: number;
            date_to_pay:
              | string
              | number
              | boolean
              | React.ReactElement<
                  any,
                  string | React.JSXElementConstructor<any>
                >
              | Iterable<React.ReactNode>
              | React.ReactPortal
              | null
              | undefined;
            state: string;
            date_cashed:
              | string
              | number
              | boolean
              | React.ReactElement<
                  any,
                  string | React.JSXElementConstructor<any>
                >
              | Iterable<React.ReactNode>
              | React.ReactPortal
              | null
              | undefined;
            statusCobro: boolean;
            date_created_o: any;
            textRetraso: any;
            statusBorrado: any;
          }) => (
            <TableRow
              key={data.id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              //idTr={data.id}
            >
              <TableCell scope="row"> {data.date_created}  </TableCell>
              <TableCell align="left">
                {data.payment_method === "Efectivo" ? (
                  <div className={Styles.typeAmount1}>
                    <RequestQuoteOutlinedIcon />
                    <span>Efectivo</span>
                  </div>
                ) : (
                  <div className={Styles.typeAmount2}>
                    <PaymentOutlinedIcon />
                    <span>Banco</span>
                  </div>
                )}
              </TableCell>
              <TableCell align="left">  {data.category}             </TableCell>
              <TableCell align="left">  {data.name}                 </TableCell>
              <TableCell align="left">  {data.concept}              </TableCell>
              <TableCell align="left">  ${formatNumber(data.amount)}</TableCell>
              <TableCell align="left">  {data.date_to_pay}          </TableCell>
              {
                status
                ? (
                  <TableCell align="left">
                    {
                      !data.statusBorrado
                        ? (
                          data.state == "Cobrado" 
                            ? (
                              <ModalTB
                                text                = {false}
                                ingreso             = {true}
                                eliminar            = {false}
                                cobradoPagado       = {true}
                                id                  = {data.id}
                                date_created_o      = {data.date_created_o}
                                cargarDatosIngresos = {cargarDatosIngresos}
                                setListaDatos       = {setListaDatos}
                                confirm2Loading     = {confirm2Loading}
                                setConfirm2Loading  = {setConfirm2Loading}
                                cargarDatosEgresos  = {cargarDatosEgresos}
                                cancelar            = {false}
                              />
                            ) : (
                              <ModalTB
                                text                = {false}
                                ingreso             = {true}
                                eliminar            = {false}
                                cobradoPagado       = {false}
                                id                  = {data.id}
                                date_created_o      = {data.date_created_o}
                                cargarDatosIngresos = {cargarDatosIngresos}
                                setListaDatos       = {setListaDatos}
                                confirm2Loading     = {confirm2Loading}
                                setConfirm2Loading  = {setConfirm2Loading}
                                cargarDatosEgresos  = {cargarDatosEgresos}
                                cancelar            = {false}
                              />
                            )
                        )
                        : (
                          <Chip
                            label     = "Cancelado"
                            size      = "small"
                            className = {Styles.chipTableNo}
                          />
                        )
                    
                    }
                  </TableCell>
                )
                : (
                  <TableCell align="left" className="IcoEstados">
                    {
                      !data.statusBorrado
                        ? data.state == "Pagado" ? (
                          <ModalTB
                            text                = {false}
                            ingreso             = {false}
                            eliminar            = {false}
                            cobradoPagado       = {true}
                            id                  = {data.id}
                            date_created_o      = {data.date_created_o}
                            cargarDatosIngresos = {cargarDatosIngresos}
                            setListaDatos       = {setListaDatos}
                            confirm2Loading     = {confirm2Loading}
                            setConfirm2Loading  = {setConfirm2Loading}
                            cargarDatosEgresos  = {cargarDatosEgresos}
                            cancelar            = {false}
                          />
                        ) : (
                          <ModalTB
                            text                = {false}
                            ingreso             = {false}
                            eliminar            = {false}
                            cobradoPagado       = {false}
                            id                  = {data.id}
                            date_created_o      = {data.date_created_o}
                            cargarDatosIngresos = {cargarDatosIngresos}
                            setListaDatos       = {setListaDatos}
                            confirm2Loading     = {confirm2Loading}
                            setConfirm2Loading  = {setConfirm2Loading}
                            cargarDatosEgresos  = {cargarDatosEgresos}
                            cancelar            = {false}
                          />
                        )
                        : (
                          <Chip
                            label     = "Cancelado"
                            size      = "small"
                            className = {Style.chipTableNo}
                          />
                        )
                    
                    }
                  </TableCell>
                )
              }
              <TableCell align="left">
                {
                  data.date_cashed !== "Pendiente"
                  ? data.statusCobro == true
                    ? <p className={Styles.txtCobrado}  >{data.date_cashed}</p>
                    : <p className={Styles.txtNoCobrado}>{data.date_cashed}</p>
                  : !data.statusBorrado
                      ? <p>{data.date_cashed + " " + data.textRetraso}</p>
                      : "Cancelado"
                }
              </TableCell>

              <TableCell className="Iconos-Tabla" align="right">
                {
                  status //if is true, it is a Ingreso, else if, it is a Egreso
                  ? (
                    <div className={Styles.btnSection}>
                      {
                        !data.statusBorrado
                          ? (
                            <Box sx={{display: "flex", gap: '5px'}}>
                              <ModalBank
                                namePerson          = {true}
                                txtCantidad         = {false}
                                inputsIngresoEgreso = {true}
                                txtConcept          = {true}
                                fechaPago           = {true}
                                text                = {''}
                                cargarDatos         = {cargarDatosIngresos}
                                edit                = {false}
                                arrayData           = {pullData}
                                rowId               = {data.id}
                                saveDataEgreso      = {false}
                                editBank            = {false}
                                setListaDatos       = {setListaDatos}
                                duplicar            = {true}
                              />
                              <ModalTB
                                text                = {false}
                                ingreso             = {true}
                                eliminar            = {true}
                                cobradoPagado       = {false}
                                id                  = {data.id}
                                date_created_o      = {data.date_created_o}
                                cargarDatosIngresos = {cargarDatosIngresos}
                                setListaDatos       = {setListaDatos}
                                confirm2Loading     = {confirm2Loading}
                                setConfirm2Loading  = {setConfirm2Loading}
                                cargarDatosEgresos  = {cargarDatosEgresos}
                                cancelar            = {true}
                              />
                              <ModalBank
                                namePerson          = {true}
                                txtCantidad         = {false}
                                inputsIngresoEgreso = {true}
                                txtConcept          = {true}
                                fechaPago           = {true}
                                text                = {''}
                                cargarDatos         = {cargarDatosIngresos}
                                edit                = {true}
                                arrayData           = {pullData}
                                rowId               = {data.id}
                                saveDataEgreso      = {false}
                                editBank            = {false}
                                setListaDatos       = {setListaDatos}
                                duplicar            = {false}
                              />
                            </Box>
                          )
                          : null
                      }
                      <ModalTB
                        text                = {false}
                        ingreso             = {true}
                        eliminar            = {true}
                        cobradoPagado       = {false}
                        id                  = {data.id}
                        date_created_o      = {data.date_created_o}
                        cargarDatosIngresos = {cargarDatosIngresos}
                        setListaDatos       = {setListaDatos}
                        confirm2Loading     = {confirm2Loading}
                        setConfirm2Loading  = {setConfirm2Loading}
                        cargarDatosEgresos  = {cargarDatosEgresos}
                        cancelar            = {false}
                      />
                    </div>
                  )
                  : (
                    <div className={Styles.btnSection}>
                      {
                        !data.statusBorrado
                          ? (
                            <Box sx={{display: "flex", gap: '5px'}}>
                              <ModalBank
                                namePerson          = {true}
                                txtCantidad         = {false}
                                inputsIngresoEgreso = {true}
                                txtConcept          = {true}
                                fechaPago           = {true}
                                text                = {''}
                                cargarDatos         = {cargarDatosEgresos}
                                edit                = {false}
                                arrayData           = {pullData}
                                rowId               = {data.id}
                                saveDataEgreso      = {true}
                                editBank            = {false}
                                setListaDatos       = {setListaDatos}
                                duplicar            = {true}
                              />
                              <ModalTB
                                text                = {false}
                                ingreso             = {false}
                                eliminar            = {true}
                                cobradoPagado       = {false}
                                id                  = {data.id}
                                date_created_o      = {data.date_created_o}
                                cargarDatosIngresos = {cargarDatosIngresos}
                                setListaDatos       = {setListaDatos}
                                confirm2Loading     = {confirm2Loading}
                                setConfirm2Loading  = {setConfirm2Loading}
                                cargarDatosEgresos  = {cargarDatosEgresos}
                                cancelar            = {true}
                              />
                              <ModalBank
                                namePerson          = {true}
                                txtCantidad         = {false}
                                inputsIngresoEgreso = {true}
                                txtConcept          = {true}
                                fechaPago           = {true}
                                text                = {''}
                                cargarDatos         = {cargarDatosEgresos}
                                edit                = {true}
                                arrayData           = {pullData}
                                rowId               = {data.id}
                                saveDataEgreso      = {true}
                                editBank            = {false}
                                setListaDatos       = {setListaDatos}
                                duplicar            = {false}
                              />
                            </Box>
                          )
                          : null
                      }
                      <ModalTB
                        text                = {false}
                        ingreso             = {false}
                        eliminar            = {true}
                        cobradoPagado       = {false}
                        id                  = {data.id}
                        date_created_o      = {data.date_created_o}
                        cargarDatosIngresos = {cargarDatosIngresos}
                        setListaDatos       = {setListaDatos}
                        confirm2Loading     = {confirm2Loading}
                        setConfirm2Loading  = {setConfirm2Loading}
                        cargarDatosEgresos  = {cargarDatosEgresos}
                        cancelar            = {false}
                      />
                    </div>
                  )
                }
              </TableCell>
            </TableRow>
          )
        )}
    </>
  );
};
