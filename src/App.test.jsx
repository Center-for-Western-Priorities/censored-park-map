import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

vi.mock('./data/parks.json', () => {
    const fs = require('fs');
    const path = require('path');
    return {
        default: JSON.parse(fs.readFileSync(path.resolve(__dirname, './data/parks.json'), 'utf-8'))
    };
});

describe('Doug Burgum Censorship Map Integration Tests', () => {
    it('renders the header properly', () => {
        const { container } = render(<App />);
        expect(screen.getByText(/Doug Burgum's Censorship Map/i)).toBeInTheDocument();
        expect(container.querySelector('.leaflet-container')).toBeInTheDocument();
    });

    it('toggles the about modal correctly', async () => {
        render(<App />);
        expect(screen.queryByText(/About This Project/i)).not.toBeInTheDocument();

        // Click the about button
        const aboutBtn = screen.getByText('About');
        await userEvent.click(aboutBtn);

        // Now it should be visible
        expect(screen.getByText(/About This Project/i)).toBeInTheDocument();
        expect(screen.getByText(/Restoring Truth and Sanity to American History/i)).toBeInTheDocument();

        // Click close
        const closeBtns = screen.getAllByRole('button').filter(b => b.classList.contains('close-btn'));
        await userEvent.click(closeBtns[0]);
        expect(screen.queryByText(/About This Project/i)).not.toBeInTheDocument();
    });

    it('verifies that markers are added based on the parks dataset', async () => {
        // Rendering the leaflet map with markers logic is tricky in JSDOM, 
        // but we can at least assert that the React component logic processes the length
        const { container } = render(<App />);
        // Leaflet attaches markers to the DOM internally, but our alert components exist inside leaflet-marker-icon
        await waitFor(() => {
            const markers = container.querySelectorAll('.custom-alert-marker');
            // If data is loaded correctly, we should have > 0 markers
            expect(markers.length).toBeGreaterThan(0);
        });
    });
});
