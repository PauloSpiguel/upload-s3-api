import styled from "styled-components";

export const Container = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Content = styled.div`
  width: 100%;
  max-width: 400px;
  margin: 30px;
  padding: 1.2rem;
  border-radius: 4px;

  background: var(--white);
  box-shadow: 2px 2px 60px rgba(0, 0, 0, 0.25);
`;
