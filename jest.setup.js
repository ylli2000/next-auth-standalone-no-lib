// Import jest-dom for DOM-related matchers
import '@testing-library/jest-dom';

// Mock fetch
import 'jest-fetch-mock';

// Mock next/router
jest.mock('next/navigation', () => ({
    ...jest.requireActual('next/navigation'),
    useRouter: jest.fn(),
    usePathname: jest.fn().mockReturnValue('/'),
    useSearchParams: jest.fn().mockReturnValue(new URLSearchParams()),
    useParams: jest.fn().mockReturnValue({})
}));

// Mock zustand
jest.mock('zustand', () => {
    const actualZustand = jest.requireActual('zustand');
    return {
        ...actualZustand,
        create: () => (fn) => {
            const store = actualZustand.create()(fn);
            const initialState = store.getState();
            store.setState = (newState) => {
                const mergedState =
                    typeof newState === 'function'
                        ? { ...initialState, ...newState(store.getState()) }
                        : { ...initialState, ...newState };
                store.getState = () => mergedState;
                return mergedState;
            };
            return store;
        }
    };
});

// Reset all mocks after each test
afterEach(() => {
    jest.clearAllMocks();
});

// For handling fetch mocks
global.fetch = jest.fn();

// Mock localStorage and sessionStorage
const localStorageMock = (() => {
    let store = {};
    return {
        getItem: jest.fn((key) => store[key] || null),
        setItem: jest.fn((key, value) => {
            store[key] = value.toString();
        }),
        removeItem: jest.fn((key) => {
            delete store[key];
        }),
        clear: jest.fn(() => {
            store = {};
        })
    };
})();

global.localStorage = localStorageMock;
global.sessionStorage = localStorageMock;
