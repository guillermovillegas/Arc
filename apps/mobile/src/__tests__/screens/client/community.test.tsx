import React from "react";
import { render } from "@testing-library/react-native";
import CommunityScreen from "@/app/(client)/community";

describe("CommunityScreen", () => {
  it("renders editorial header", () => {
    const { getByText } = render(<CommunityScreen />);

    expect(getByText("COMMUNITY")).toBeTruthy();
    expect(getByText("say.")).toBeTruthy();
  });

  it("displays curated client pull quotes", () => {
    const { getByText } = render(<CommunityScreen />);

    expect(
      getByText(
        "I haven't left my apartment for a haircut in seven months. I don't intend to.",
      ),
    ).toBeTruthy();
    expect(
      getByText(
        "It used to be an errand. Now it's the part of the week I look forward to.",
      ),
    ).toBeTruthy();
  });

  it("displays attributions for each quote", () => {
    const { getByText } = render(<CommunityScreen />);

    expect(getByText("— Maeve, Logan Square")).toBeTruthy();
    expect(getByText("— Jules, West Loop")).toBeTruthy();
    expect(getByText("— Theo, Lincoln Park")).toBeTruthy();
  });

  it("renders an opening quotation mark per quote block", () => {
    const { getAllByText } = render(<CommunityScreen />);
    // Three quote blocks → three opening quote marks (rendered via &ldquo;).
    expect(getAllByText("“").length).toBe(3);
  });

  it("does not crash when rendered (static screen, no data fetch)", () => {
    const { getByText } = render(<CommunityScreen />);
    expect(getByText("COMMUNITY")).toBeTruthy();
  });
});
