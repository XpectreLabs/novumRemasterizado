import Styles         from "./responsive.module.scss";
import Box            from "@mui/material/Box";
import IconButton     from "@mui/material/IconButton";
import Chip           from "@mui/material/Chip";
import MoneyOffIcon   from "@mui/icons-material/MoneyOff";
import PriceCheckIcon from "@mui/icons-material/PriceCheck";
import MoreVertIcon   from "@mui/icons-material/MoreVert";
import Menu           from '@mui/material/Menu';
import MenuItem       from '@mui/material/MenuItem';
import { ModalBank }  from '../../organims/modalRegister';
import { ModalTB }    from '../../organims/modalTable';
import { useState }   from "react";

export const ResponsiveDesing = ({
  listaDatos,
  ingreso,
  setListaDatos,
  cargarDatosIngresos,
  cargarDatosEgresos,
  confirm2Loading,
  setConfirm2Loading,
}: {
  listaDatos:           any;
  ingreso:              boolean;
  setListaDatos:        any;
  cargarDatosIngresos:  Function;
  cargarDatosEgresos:   Function;
  confirm2Loading:      any;
  setConfirm2Loading:   Function;
}) => {
  const formatNumber = (number: number | bigint) =>
    new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(number);

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
      setAnchorEl(null);
    };

    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
      setIsOpen(!isOpen);
    };

  return (
    <Box className={Styles.container}>
      {listaDatos.map(
        (item: {
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
      }) => (
        <Box        className = {Styles.results} key={item.id}>
          <Box      className = {Styles.conten}>
            <Box    className = {Styles.resultResponsive}>
              <Box  className = {Styles.btnEdit}>
                <Box className={Styles.dropdown}>
                  <IconButton     
                    aria-label      = "Edition" 
                    size            = "small"
                    onClick         = {toggleDropdown}
                  >
                    <MoreVertIcon fontSize = "small" />
                  </IconButton>
                  {isOpen && (
                    ingreso
                      ? (
                        <div className={Styles.dropdownContent}>
                          <ModalBank
                            namePerson          = {true}
                            txtCantidad         = {false}
                            inputsIngresoEgreso = {true}
                            txtConcept          = {true}
                            fechaPago           = {true}
                            text                = {true}
                            cargarDatos         = {cargarDatosIngresos}
                            edit                = {true}
                            arrayData           = {listaDatos}
                            rowId               = {item.id}
                            saveDataEgreso      = {false}
                            editBank            = {false}
                            setListaDatos       = {setListaDatos}
                            duplicar            = {false}
                          /> 
                          <ModalBank
                            namePerson          = {true}
                            txtCantidad         = {false}
                            inputsIngresoEgreso = {true}
                            txtConcept          = {true}
                            fechaPago           = {true}
                            text                = {true}
                            cargarDatos         = {cargarDatosIngresos}
                            edit                = {false}
                            arrayData           = {listaDatos}
                            rowId               = {item.id}
                            saveDataEgreso      = {false}
                            editBank            = {false}
                            setListaDatos       = {setListaDatos}
                            duplicar            = {true}
                          /> 
                          <ModalTB
                            text                = {true}
                            ingreso             = {true}
                            eliminar            = {true}
                            cobradoPagado       = {false}
                            id                  = {item.id}
                            date_created_o      = {item.date_created_o}
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
                        <div className={Styles.dropdownContent}>
                          <ModalBank
                            namePerson          = {true}
                            txtCantidad         = {false}
                            inputsIngresoEgreso = {true}
                            txtConcept          = {true}
                            fechaPago           = {true}
                            text                = {true}
                            cargarDatos         = {cargarDatosEgresos}
                            edit                = {true}
                            arrayData           = {listaDatos}
                            rowId               = {item.id}
                            saveDataEgreso      = {true}
                            editBank            = {false}
                            setListaDatos       = {setListaDatos}
                            duplicar            = {false}
                          />
                          <ModalBank
                            namePerson          = {true}
                            txtCantidad         = {false}
                            inputsIngresoEgreso = {true}
                            txtConcept          = {true}
                            fechaPago           = {true}
                            text                = {true}
                            cargarDatos         = {cargarDatosEgresos}
                            edit                = {false}
                            arrayData           = {listaDatos}
                            rowId               = {item.id}
                            saveDataEgreso      = {true}
                            editBank            = {false}
                            setListaDatos       = {setListaDatos}
                            duplicar            = {true}
                          />
                          <ModalTB
                            text                = {true}
                            ingreso             = {false}
                            eliminar            = {true}
                            cobradoPagado       = {false}
                            id                  = {item.id}
                            date_created_o      = {item.date_created_o}
                            cargarDatosIngresos = {cargarDatosIngresos}
                            setListaDatos       = {setListaDatos}
                            confirm2Loading     = {confirm2Loading}
                            setConfirm2Loading  = {setConfirm2Loading}
                            cargarDatosEgresos  = {cargarDatosEgresos}
                            cancelar            = {false}
                          />
                        </div>
                      )
                    
                  )}
                </Box>
              </Box>
              <Box  className = {Styles.columnas}>
                <li>Fecha de creación:      </li>
                <li>Persona o empresa:      </li>
                <li>Concepto:               </li>
                <li>Monto:                  </li>
                <li>Fecha tentativa de pago:</li>
                <li>
                  {
                    ingreso
                      ? 'Fecha en la que se cobró:'
                      : 'Fecha en la que se pagó:'
                  }
                </li>
                <li>Estatus:                </li>
                <li>
                  <p>{item.date_created}    </p>
                </li>
                <li>
                  <p>{item.name}            </p>
                </li>
                <li>
                  <p>{item.concept}         </p>
                </li>
                <li>
                  <p>$ {formatNumber(item.amount)}</p>
                </li>
                <li>
                  <p>{item.date_to_pay}</p>
                </li>
                <li>
                  <p>{item.date_cashed}</p>
                </li>
                <li>
                  {item.state == "Cobrado" ? (
                    <Chip
                      icon      = {<PriceCheckIcon />}
                      size      = "small"
                      label     = "Cobrado"
                      className = {Styles.chipTable}
                    />
                  ) : (
                    <Chip
                      icon      = {<MoneyOffIcon />}
                      label     = "No cobrado"
                      size      = "small"
                      className = {Styles.chipTableNo}
                    />
                  )}
                </li>
              </Box>
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  );
};
