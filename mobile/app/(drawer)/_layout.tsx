import { Drawer } from "expo-router/drawer";
export default function DrawerLayout() {
  return (
    <Drawer>
      <Drawer.Screen
        name="(tabs)"
        options={{
          drawerLabel: "Dashboard",
          title: "Menu",
        }}
      />
      <Drawer.Screen
        name="login"
        options={{ drawerLabel: "Login", headerShown: false }}
      />
      <Drawer.Screen name="about" options={{ drawerLabel: "About Us" }} />
      <Drawer.Screen name="help" options={{ drawerLabel: "Help" }} />
      <Drawer.Screen name="contact" options={{ drawerLabel: "Contact" }} />
    </Drawer>
  );
}
