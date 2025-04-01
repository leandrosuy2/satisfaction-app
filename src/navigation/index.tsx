import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../app/index';
import SelectCompanyScreen from '../app/select-company';
import VoteScreen from '../app/vote';

const Stack = createNativeStackNavigator();

export default function Navigation() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SelectCompany" component={SelectCompanyScreen} />
            <Stack.Screen name="Vote" component={VoteScreen} />
        </Stack.Navigator>
    );
} 