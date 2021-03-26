import styled from "styled-components";

export const Container = styled.ul`
  margin-top: 1.2rem;
  max-height: 400px;
  overflow-y: auto;

  > li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #444;

    & + li {
      margin-top: 1rem;
    }

    > div {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.2rem;

      > a {
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
`;

export const FileInfo = styled.div`
  display: flex;
  align-items: center;

  > div {
    display: flex;
    flex-direction: column;

    > span {
      font-size: 0.8rem;
      color: var(--text);
      margin-top: 4px;

      > button {
        background: transparent;
        color: var(--red);
        border: 0;
        margin-left: 5px;
        outline: 0;
        cursor: pointer;
      }
    }
  }
`;

export const Preview = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 5px;

  background-image: url(${(props) => props.src});
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 50% 50%;
  margin-right: 10px;
`;

export const Loading = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;

  padding: 0.5rem;
  color: var(--text);
`;
