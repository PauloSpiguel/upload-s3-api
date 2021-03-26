import FileList from "./components/FileList";
import Upload from "./components/upload";
import { Container, Content } from "./styles/pages/appStyles";

function App() {
  return (
    <Container>
      <Content>
        <Upload />
        <FileList />
      </Content>
    </Container>
  );
}

export default App;
