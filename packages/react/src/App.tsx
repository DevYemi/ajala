import "./App.css";
import "ajala.js/dist/ajala.css";
import { AjalaJourneyProvider } from "./components/AjalaJourneyProvider";
import DummyCustomTooltip from "./components/DummyCustomTooltip";
import DummyCustomArrow from "./components/DummyCustomArrow";
import { useEffect, useState } from "react";

function App() {
  const [options, setOptions] = useState({
    start_immediately: true,
    tooltip_gutter: 30,
    overlay_options: {
      color: "white",
      opacity: 0.6,
    },
    spotlight_options: {
      border_radius: 5,
      padding: 5,
    },
  });

  useEffect(() => {
    setTimeout(() => {
      setOptions({
        start_immediately: true,
        tooltip_gutter: 30,
        overlay_options: {
          color: "red",
          opacity: 0.6,
        },
        spotlight_options: {
          border_radius: 5,
          padding: 5,
        },
      });
    }, 5000);
  }, []);
  return (
    <AjalaJourneyProvider
      steps={[
        {
          target: ".step_2",
          id: "1",
          title: "Step 2 Title",
          content: "step 2 content lorem ipson",
          tooltip_placement: "left_top",
          enable_target_interaction: true,
        },
        {
          target: ".step_3",
          id: "3",
          title: "Step 3 Title",
          content: "step 3 content loremjgj jgjgjgj hjhjh jhjgj ipson",
          tooltip_placement: {
            default: `top_right`,
            "(min-width: 700px)": "top_center",
            "(min-width: 500px)": "top_left",
          },
        },
        {
          target: ".step_41",
          id: "4",
          title: "Step 4 Title",
          content: "step 4 content",
          tooltip_placement: "bottom_right",
        },
        {
          target: ".step_5",
          id: "5",
          title: "Step 5 Title",
          content: "step 5 content lorem ipson",
          tooltip_placement: "left_top",
        },
        {
          target: ".step_6",
          id: "6",
          title: "Step 6 Title",
          content:
            "step 6 content jgdajdgaj sjdhsjdhgsjd kshksdhskdhsdk kjshjshdsjshs kjshjshd lorem ipson",
          tooltip_placement: "left_bottom",
        },
        {
          target: ".step_7",
          id: "7",
          title: "Step 7 Title",
          content: "step 7 content lorem ipson",
        },
        {
          target: ".step_8",
          id: "8",
          title: "Step 8 Title",
          content: "step 8 content lorem ipson",
        },
        {
          target: ".step_9",
          id: "9",
          title: "Step 9 Title",
          content: "step 9 content lorem ipson",
          tooltip_placement: "left_bottom",
        },
      ]}
      CustomTooltip={DummyCustomTooltip}
      CustomArrow={DummyCustomArrow}
      options={options}
      onStart={(e) => {
        console.log("Adeyanju", e);
      }}
    >
      <div className="outter-container">
        <header className="header">
          <nav className="logo">
            <div className="step_1">Your Logo</div>
            <a href="" className="btn step_2">
              {" "}
              Sign In
            </a>
          </nav>

          <div className="inner-container">
            <div className="inner-title step_3">
              <h1>Unlimited movies, TV shows, and more.</h1>
            </div>
            <div style={{ width: "fit-content" }} className="inner-text step_4">
              <p>Wat</p>
            </div>

            <div className="email-form">
              <p>
                Ready to watch? Enter your email to create or restart your
                membership.
              </p>

              <div className="get-started">
                <input type="text" name="" id="" placeholder="Email address" />
                <a href="" className="btn-lg">
                  Get started{" "}
                </a>
              </div>
            </div>
          </div>
          <div className="overlay"></div>
        </header>

        <section className="showcase">
          <div className="showcase-container case1">
            <div className="inner-container">
              <div className="inner-title step_5">
                <h1>Enjoy on your TV.</h1>
              </div>
              <div className="inner-text">
                <p>
                  Watch on Smart TVs, Playstation, Xbox, Chromecast, Apple TV,
                  Blu-ray players, and more.
                </p>
              </div>
            </div>
            <div className="showcase-img">
              <img
                src="https://assets.nflxext.com/ffe/siteui/acquisition/ourStory/fuji/desktop/tv.png"
                alt=""
              />
              <video
                className="showcase-animation"
                autoPlay
                playsInline
                muted
                loop
              >
                <source
                  src="https://assets.nflxext.com/ffe/siteui/acquisition/ourStory/fuji/desktop/video-tv-0819.m4v"
                  type="video/mp4"
                />
              </video>
            </div>
          </div>
        </section>

        <section className="showcase">
          <div className="showcase-container case2">
            <div className="showcase-img">
              <img
                src="https://assets.nflxext.com/ffe/siteui/acquisition/ourStory/fuji/desktop/mobile-0819.jpg"
                alt=""
              />
              <div className="downloading">
                <img
                  src="https://assets.nflxext.com/ffe/siteui/acquisition/ourStory/fuji/desktop/boxshot.png"
                  alt=""
                />
                <div className="download-text">
                  <h1>Stranger Things</h1>
                  <p>Downloading...</p>
                </div>
              </div>
            </div>
            <div className="inner-container step_6">
              <div className="inner-title">
                <h1>Download your shows to watch offline.</h1>
              </div>
              <div className="inner-text">
                <p>
                  Save your favorites easily and always have something to watch.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="showcase">
          <div className="showcase-container case3">
            <div className="inner-container">
              <div className="inner-title step_7">
                <h1>Watch everywhere.</h1>
              </div>
              <div className="inner-text">
                <p>
                  Stream unlimited movies and TV shows on your phone, tablet,
                  laptop, and TV without paying more.
                </p>
              </div>
            </div>
            <div className="showcase-img">
              <img
                src="https://assets.nflxext.com/ffe/siteui/acquisition/ourStory/fuji/desktop/device-pile.png"
                alt=""
              />
              <video
                className="showcase-animation"
                autoPlay
                playsInline
                muted
                loop
              >
                <source
                  src="https://assets.nflxext.com/ffe/siteui/acquisition/ourStory/fuji/desktop/video-devices.m4v"
                  type="video/mp4"
                />
              </video>
            </div>
          </div>
        </section>

        <section className="faq">
          <div className="inner-container">
            <div
              style={{ width: "fit-content" }}
              className="inner-title step_9"
            >
              <h1>Frequently Asked Questions</h1>
            </div>

            <ul>
              <li>
                <h2>
                  What is Netflix <i className="fas fa-plus"></i>
                </h2>
                <p>
                  Netflix is a streaming service that offers a wide variety of
                  award-winning TV shows, movies, anime, documentaries, and more
                  on thousands of internet-connected devices. <br />
                  You can watch as much as you want, whenever you want without a
                  single commercial – all for one low monthly price. There's
                  always something new to discover and new TV shows and movies
                  are added every week!
                </p>
              </li>
              <li>
                <h2>
                  How much does NetFlix cost? <i className="fas fa-plus"></i>
                </h2>
                <p>
                  Watch Netflix on your smartphone, tablet, Smart TV, laptop, or
                  streaming device, all for one fixed monthly fee. <br />
                  Plans range from TWD270 to TWD390 a month. No extra costs, no
                  contracts.
                </p>
              </li>
              <li>
                <h2>Where can I watch?</h2>
                <p>
                  Watch anywhere, anytime, on an unlimited number of devices.
                  Sign in with your Netflix account to watch instantly on the
                  web at netflix.com from your personal computer or on any
                  internet-connected device that offers the Netflix app,
                  including smart TVs, smartphones, tablets, streaming media
                  players and game consoles. <br />
                  You can also download your favorite shows with the iOS,
                  Android, or Windows 10 app. Use downloads to watch while
                  you're on the go and without an internet connection. Take
                  Netflix with you anywhere.
                </p>
              </li>
              <li>
                <h2>
                  How do I cancel?<i className="fas fa-plus"></i>
                </h2>
                <p>
                  Netflix is flexible. There are no pesky contracts and no
                  commitments. You can easily cancel your account online in two
                  clicks. There are no cancellation fees – start or stop your
                  account anytime.
                </p>
              </li>
              <li>
                <h2>
                  What can I watch on Netflix?<i className="fas fa-plus"></i>
                </h2>
                <p>
                  Netflix has an extensive library of feature films,
                  documentaries, TV shows, anime, award-winning Netflix
                  originals, and more. Watch as much as you want, anytime you
                  want.
                </p>
              </li>
            </ul>

            <div className="email-form">
              <p>
                Ready to watch? Enter your email to create or restart your
                membership.
              </p>

              <div className="get-started">
                <input type="text" name="" id="" placeholder="Email address" />
                <a href="" className="btn-lg">
                  Get started{" "}
                </a>
              </div>
            </div>
          </div>
        </section>

        <footer>
          <p>Questions? Contact us.</p>
          <div className="links">
            <ul>
              <li>FAQ</li>
              <li>Help Center</li>
              <li>Account</li>
              <li>Media Center</li>
              <li>Investor Relations</li>
              <li>Jobs</li>
              <li>Ways to Watch</li>
              <li>Terms of Use</li>
              <li>Privacy</li>
              <li>Cookie Preferences</li>
              <li>Corporate Information</li>
              <li>Contact Us</li>
              <li>Speed Test</li>
              <li>Legal Notices</li>
              <li>Netflix Originals</li>
            </ul>
            <div className="language step_8" id="language-btn">
              <i className="fas fa-globe"></i> English
              <i className="fas fa-sort-down lg"></i>
              <div className="dropdown-list">
                <ul className="" id="language-dropdown">
                  <li>中文</li>
                  <li>English</li>
                </ul>
              </div>
            </div>
            <p>NetFlix Taiwan</p>
          </div>
        </footer>
      </div>
    </AjalaJourneyProvider>
  );
}

export default App;
