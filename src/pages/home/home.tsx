import React, { useState }                      from "react";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import type { MenuProps }                       from "antd";
import { Avatar, Space }                        from "antd";
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
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';

const drawerWidth = 250;

const { Header, Content, Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

const iniciales_usuario = localStorage.getItem('iniciales');

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
  getItem("Resumen", "1", <div className={style.container}><MenuBookOutlinedIcon className={style.iconMenu}/></div>),
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
  const { window }                        = props;
  const [mobileOpen,    setMobileOpen]    = React.useState(false);
  const [egresoActive,  setEgresoActive]  = React.useState(true);
  const [collapsed,     setCollapsed]     = useState(false);
  const [page,          setPage]          = useState("1");
  const [resumenActive, setResumenActive] = React.useState(false);
  const [cajaActive,    setCajaActive]    = React.useState(true);
  const [ingresoActive, setIngresoActive] = React.useState(true);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const container =
    window !== undefined ? () => window().document.body : undefined;

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
