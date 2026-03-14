import { useState } from 'react';
import { Header } from './components/layout/Header';
import { DisciplineSelector } from './components/layout/DisciplineSelector';
import { TabNav } from './components/layout/TabNav';
import { TabParameter } from './components/tabs/TabParameter';
import { TabMitarbeiter } from './components/tabs/TabMitarbeiter';
import { TabLeistungsmix } from './components/tabs/TabLeistungsmix';
import { TabAuswertung } from './components/tabs/TabAuswertung';
import { TabBEP } from './components/tabs/TabBEP';
import { LoginScreen } from './components/layout/LoginScreen';

export default function App() {
  const [activeTab, setActiveTab] = useState('parameter');
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => sessionStorage.getItem('upa_auth') === 'true'
  );

  if (!isAuthenticated) {
    return <LoginScreen onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      <DisciplineSelector />
      <TabNav active={activeTab} onChange={setActiveTab} />
      <main className="flex-1 overflow-auto">
        <div key={activeTab} className="tab-enter">
          {activeTab === 'parameter'    && <TabParameter />}
          {activeTab === 'mitarbeiter'  && <TabMitarbeiter />}
          {activeTab === 'leistungsmix' && <TabLeistungsmix />}
          {activeTab === 'auswertung'   && <TabAuswertung />}
          {activeTab === 'bep'          && <TabBEP />}
        </div>
      </main>
    </div>
  );
}
