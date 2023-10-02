import React, { useState, useEffect }           from "react";
import type { MenuProps }                       from "antd";
import { Layout, Button, Menu, theme }          from "antd";
import AppBar                                   from "@mui/material/AppBar";
import Box                                      from "@mui/material/Box";
import Divider                                  from "@mui/material/Divider";
import Drawer                                   from "@mui/material/Drawer";
import IconButton                               from "@mui/material/IconButton";
import MenuIcon                                 from "@mui/icons-material/Menu";
import Toolbar                                  from "@mui/material/Toolbar";
import style                                    from "./home.module.scss";
import { Resumen }                              from "../../components/molecules/resumen";
import { RegistrarCajaOBanco }                  from "../../hooks/RegistrarCajaOBanco";
import { RegistrarIngresosFuturos }             from "../../hooks/RegistrarIngresosFuturos";
import { RegistrarEgresosFuturos }              from "../../hooks/RegistrarEgresos";
import { CerrarSesion }                         from '../../cerrarSesion';
import MenuBookOutlinedIcon                     from '@mui/icons-material/MenuBookOutlined';

const drawerWidth = 250;

const { Header, Content, Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

const iniciales_usuario = localStorage.getItem('iniciales');

const user_id = localStorage.getItem('user_id');

function getItem(
  label:      React.ReactNode,
  key:        React.Key,
  icon?:      React.ReactNode,
  children?:  MenuItem[],
  type?:      "group"
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem("Resumen", "1", <span className={style.container}><MenuBookOutlinedIcon className={style.iconMenu}/></span>),
  getItem(
    "Registrar caja o banco",
    "2",
    <span className="icon-icoRegistrarCB"></span>
  ),
  getItem(
    "Registrar ingresos futuros",
    "3",
    <span className="icon-icoIngreso">    </span>
  ),
  getItem(
    "Registrar egresos futuros",
    "4",
    <span className="icon-icoEgereso">    </span>
  ),
];

export const Home = (props: any) => {
  const { window1 }                       = props;
  const [mobileOpen,    setMobileOpen]    = React.useState(false);
  const [egresoActive,  setEgresoActive]  = React.useState(true);
  const [collapsed,     setCollapsed]     = useState(false);
  const [page,          setPage]          = useState("1");
  const [resumenActive, setResumenActive] = React.useState(false);
  const [cajaActive,    setCajaActive]    = React.useState(true);
  const [ingresoActive, setIngresoActive] = React.useState(true);

  if (user_id == '' || user_id == null) {
    console.log('No se encontró ninguna sesión abierta');
    window.location.href ='/';
  }

 /*const loader = async () => {
    const user = await localStorage.getItem('user_id');
    if (user === "" || user === null || !user ) {
      return redirect("/");
    }
  };

  loader();*/

  /*useEffect(() => {
    if (localStorage.getItem('user_id') === '' || localStorage.getItem('user_id') === null) {
      window.location.href = '/';
    }
  }, [window]);*/
 

  function verificar() {
    let scriptURL = localStorage.getItem('site')+"/todos";
    let dataUrl = {user_id};

    fetch(scriptURL, {
      method: 'POST',
      body: JSON.stringify(dataUrl),
      headers:{
        'Content-Type': 'application/json'
      }
    })
    .then((resp) => resp.json())
    .then(function(info) {
      info['caja']!==0||info['ingreso']!==0||info['egreso']!==0?setResumenActive(true):setResumenActive(false);
      info['caja']===0?setCajaActive(false):setCajaActive(true);
      info['ingreso']===0?setIngresoActive(false):setIngresoActive(true);
      info['egreso']===0?setEgresoActive(false):setEgresoActive(true);
    })
    .catch(error => {
      console.log(error.message);
      console.error('Error!', error.message);
    });
  }

  verificar();

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const container =
    window1 !== undefined ? () => window1().document.body : undefined;

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const onClick: MenuProps["onClick"] = (e) => {
    setPage(e.key);
  };

  const cambioRegistroBan = () => {
    setPage("2");
  };

  const Cambio = (props: any) => {
    if (props.pos === "1") {
      return <Resumen                   cambioRegistroBan={cambioRegistroBan} />;
    } else if (props.pos === "2") {
      return <RegistrarCajaOBanco cajaActive={cajaActive} setCajaActive={setCajaActive} />;
    } else if (props.pos === "3") {
      return <RegistrarIngresosFuturos ingresoActive={ingresoActive} setIngresoActive={setIngresoActive} />;
    } else if (props.pos === "4") {
      return (
        <RegistrarEgresosFuturos
          egresoActive    = {egresoActive}
          setEgresoActive = {setEgresoActive}
        />
      );
    }

    // Agrega un caso por defecto para manejar otros valores de props.pos
    return null; // O cualquier otro elemento JSX que desees renderizar por defecto
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <span className={`${style.HomeLogo} icon-logo`}>
        <span className="path1"></span>
        <span className="path2"></span>
        <span className="path3"></span>
        <span className="path4"></span>
        <span className="path5"></span>
        <span className="path6"></span>
      </span>
      <Divider />
      <Menu
        className           = {style.prueba}
        defaultSelectedKeys = {[page]}
        selectedKeys        = {[page]}
        mode                = "inline"
        onClick             = {onClick}
        items               = {items}
      />
    </Box>
  );

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <AppBar className={style.mobile} component="nav">
        <Toolbar>
          <Box>
            <IconButton
              aria-label  = "open drawer"
              edge        = "start"
              onClick     = {toggleCollapsed}
              classes={{root: style.btnNav}}
              sx={{ mr: 2, display: { sm: "block" } }}
            >
              <MenuIcon />
            </IconButton>

            <IconButton
              aria-label  = "open drawer"
              edge        = "start"
              onClick     = {handleDrawerToggle}
              classes={{root: style.btnNavMobile}}
              sx={{ mr: 2, display: { xs: "block", sm: "none" } }}
            >
              <MenuIcon />
            </IconButton>
            <span className={`${style.HomeLogo} icon-logo`}>
              <span className="path1"></span>
              <span className="path2"></span>
              <span className="path3"></span>
              <span className="path4"></span>
              <span className="path5"></span>
              <span className="path6"></span>
            </span>
          </Box>
          <CerrarSesion iniciales={iniciales_usuario} />
        </Toolbar>
      </AppBar>

      <Sider
        className={style.btnNav}
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
          <span className={`${style.HomeLogo} icon-logo`}>
            <span className="path1"></span>
            <span className="path2"></span>
            <span className="path3"></span>
            <span className="path4"></span>
            <span className="path5"></span>
            <span className="path6"></span>
          </span>
          <Divider />
          <Menu
            className           = {style.prueba}
            defaultSelectedKeys = {[page]}
            selectedKeys        = {[page]}
            mode                = "inline"
            onClick             = {onClick}
            items               = {items}
          />
        </Box>
      </Sider>

      <Box component="nav">
        <Drawer
          className={style.btnNavMobile}
          container   = {container}
          variant     = "temporary"
          open        = {mobileOpen}
          onClose     = {handleDrawerToggle}
          ModalProps  = {{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width:      drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      <Content    style={{ margin: "50px 16px" }} className="u-textCenter">
        <Cambio   pos={page} />
      </Content>
    </Layout>
  );
};
