import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import { AiFillStar, AiOutlineLoading } from "react-icons/ai";
import axios from "axios";
import cheerio from "cheerio";
import { fetchAnime } from "../Fetch/fetchAnime";
import { Element, animateScroll as scroll, scrollSpy, scroller } from "react-scroll";
import Genre from "../Homepage/Genre";
import Navbar from "../Navbar/Navbar";
import Style from "./Id.module.scss";
import getAnime from "../../utility/getAnime";

const IdRender = () => {
  const [id, setId] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState();
  useEffect(() => {
    const windowloc = window.location.pathname;
    setId(windowloc.split("/anime/").join(""));
  }, []);
  useEffect(() => {
    async function fetchData() {
      let fetch = await fetchAnime.animeInfo(id);
      setData([fetch]);
    }
    id && fetchData();
  }, [id]);
  return (
    <>
      <Navbar />
      <div className='px-[5vw] py-5 grid grid-cols-5 gap-10'>
        <div className='flex flex-col gap-5 col-span-4'>
          {data ? (
            <>
              {data.map((item, i) => {
                return (
                  <div key={i}>
                    <Vid item={item} />
                    <h1 className='text-white font-bold text-4xl'>{item.title}</h1>
                    <div className='grid grid-cols-4 gap-10'>
                      <InfoLeft item={item} />
                      <div className='col-span-3'>
                        <div className='flex gap-10'></div>
                        <div>
                          <h1 className='text-white text-lg font-semibold'>Summary</h1>
                          <p className='text-gray-500'>{item.summary ? item.summary : "N/A"}</p>
                        </div>
                        <div>
                          <Episodes item={item} id={id} />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </>
          ) : (
            <div className='bg-gray-500 bg-opacity-20 rounded-xl h-[75vh] col-span-4 flex justify-center items-center text-7xl text-white'>
              <AiOutlineLoading className='animate-spin' />
            </div>
          )}
        </div>
        <Genre />
      </div>
    </>
  );
};

const InfoLeft = ({ item }) => {
  return (
    <div className='flex flex-col gap-5'>
      <img src={item.thumbnail} className='w-full object-cover rounded-2xl h-[26vw]' alt='' />
      <div className='grid place-items-start gap-2'>
        <div className='flex gap-2'>
          <h1 className='text-white font-semibold whitespace-nowrap'>Type :</h1>
          <p className='text-gray-500'>{item.type ? item.type : "N/A"}</p>
        </div>
        <div className='flex gap-2'>
          <h1 className='text-white font-semibold whitespace-nowrap'>Released : </h1>
          <p className='text-gray-500'>{item.released ? item.released : "N/A"}</p>
        </div>
        <div className='flex gap-2'>
          <h1 className='text-white font-semibold whitespace-nowrap'>Status :</h1>
          <p className='text-gray-500'>{item.status ? item.status : "N/A"}</p>
        </div>
        <div className='flex gap-2'>
          <h1 className='text-white font-semibold whitespace-nowrap'>Episodes :</h1>
          <p className='text-gray-500'>{item.episodeCount ? item.episodeCount : "N/A"}</p>
        </div>
        <div className='flex gap-2'>
          <h1 className='text-white font-semibold whitespace-nowrap'>Genres :</h1>
          <p className='text-gray-500 flex flex-col'>
            {item.genres.map((e) => e.title) ? item.genres.map((e) => e.title).join(", ") : "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
};

const Episodes = ({ item, id }) => {
  const [epPage, setEpPage] = useState(0);
  const [eplist, setEplist] = useState([]);
  const [scrollid, setScrollid] = useState("1");
  useEffect(() => {
    setEplist(item.episodePages[epPage]);
  }, [epPage]);
  useEffect(() => {
    scrollid
      ? scroller.scrollTo(scrollid, {
          duration: 800,
          delay: 0,
          smooth: "easeInOutQuart",
          containerId: "scroll-container",
        })
      : scroller.scrollTo("1", {
          duration: 800,
          delay: 0,
          smooth: "easeInOutQuart",
          containerId: "scroll-container",
        });
  }, [scrollid]);
  return (
    <div className='flex flex-col'>
      <div className='flex justify-between items-center'>
        <h1 className='text-white text-lg font-semibold py-2'>Episodes</h1>
        <input
          className={`${Style.hide__arrow} text-sm bg-transparent outline-none whitespace-nowrap text-white overflow-hidden w-[10%]`}
          type='number'
          min='1'
          max={item.episodeCount}
          placeholder='Jump to'
          onInput={(e) => {
            setScrollid(e.target.value);
          }}
        />
      </div>
      <div className='grid gap-3 overflow-hidden h-[25rem]'>
        <div id='scroll-container' className={`overflow-auto ${Style.hide__scroll}`}>
          {item.episodeCount > 0 ? (
            Array.from(Array(item.episodeCount), (_, i) => (
              <Link key={i} href={`/anime/${id}?ep=${i + 1}`}>
                <Element
                  name={`${i + 1}`}
                  className='flex items-center border-b py-3 text-gray-500 hover:text-white transition-all border-gray-700 cursor-pointer'>
                  Episode {i + 1}
                </Element>
              </Link>
            ))
          ) : (
            <p className='text-gray-500 flex flex-col'>N/A</p>
          )}
        </div>
      </div>
    </div>
  );
};

const Vid = ({ item }) => {
  const [id, setId] = useState("");
  const [data, setData] = useState([]);
  const [vid, setVid] = useState(null);
  const [loading, setLoading] = useState();
  useEffect(() => {
    const windowloc = window.location.search;
    setId(item.id + "-episode-" + windowloc.split("?ep=").join(""));
    // setId(windowloc.split(`/anime/`).join(""));
  });
  useEffect(() => {
    async function fetchData() {
      let fetch = await fetchAnime.animeEpisodeInfo(id);
      setData([fetch]);
    }
    id && fetchData();
  }, [id]);
  useEffect(async () => {
    const windowloc = window.location.search.split("?ep=").join("");
    const getAn = await getAnime(item.id, windowloc);
    windowloc.length > 3 && setVid(getAn);
  }, [id]);
  console.log(vid);
  return <div></div>;
};

export default IdRender;